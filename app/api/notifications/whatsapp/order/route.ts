import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export const runtime = "nodejs";
function normalizePhone(v: string | null | undefined) { return String(v || "").replace(/[^0-9]/g, ""); }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = String(body?.orderId || "").trim();
    const status = String(body?.status || "").trim();
    const note = String(body?.note || "").trim();
    if (!orderId || !status) return NextResponse.json({ error: "orderId and status are required." }, { status: 400 });
    const authHeader = request.headers.get("authorization") || "";
    const accessToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!accessToken) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    const publicClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data: { user }, error: userError } = await publicClient.auth.getUser(accessToken);
    if (userError || !user) return NextResponse.json({ error: "Invalid session." }, { status: 401 });

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (!profile || !["admin", "super_admin", "staff"].includes(String(profile.role))) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    const { data: order, error } = await supabase.from("orders").select("id,order_number,customer_name,phone").eq("id", orderId).single();
    if (error || !order) return NextResponse.json({ error: error?.message || "Order not found." }, { status: 404 });
    const eventKey = `${order.id}:${status}`;
    const { data: existing } = await supabase.from("order_notifications").select("id").eq("event_key", eventKey).eq("channel", "whatsapp").maybeSingle();
    if (existing) return NextResponse.json({ ok: true, duplicate: true });
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const apiVersion = process.env.WHATSAPP_API_VERSION || "v23.0";
    const templateName = process.env.WHATSAPP_ORDER_TEMPLATE_NAME;
    const templateLanguage = process.env.WHATSAPP_ORDER_TEMPLATE_LANGUAGE || "en_US";
    if (!token || !phoneNumberId || !templateName) return NextResponse.json({ ok: false, skipped: true, reason: "WhatsApp is not configured." });
    const to = normalizePhone(order.phone);
    if (!to) return NextResponse.json({ ok: false, skipped: true, reason: "Customer phone is missing." });
    const message = { messaging_product: "whatsapp", to, type: "template", template: { name: templateName, language: { code: templateLanguage }, components: [{ type: "body", parameters: [
      { type: "text", text: order.customer_name || "Customer" }, { type: "text", text: order.order_number || order.id },
      { type: "text", text: status }, { type: "text", text: note || `Your order is now ${status}.` },
    ] }] } };
    const response = await fetch(`https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(message) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) { console.error("WhatsApp API error:", result); return NextResponse.json({ ok: false, error: result?.error?.message || "WhatsApp API request failed." }); }
    await supabase.from("order_notifications").insert({ order_id: order.id, event_key: eventKey, channel: "whatsapp", status, recipient: to, provider_message_id: result?.messages?.[0]?.id || null });
    return NextResponse.json({ ok: true });
  } catch (e: any) { console.error("WhatsApp notification route error:", e); return NextResponse.json({ ok: false, error: e?.message || "Notification failed." }); }
}
