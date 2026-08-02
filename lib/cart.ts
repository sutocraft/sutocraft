import { supabase } from "./supabase";

function getSessionId() {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem("sutocraft_session");

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("sutocraft_session", sessionId);
  }

  return sessionId;
}

export async function addToCart({
  productId,
  sizeId,
  colorId,
  quantity,
}: {
  productId: string;
  sizeId: string;
  colorId: string;
  quantity: number;
}) {
  const sessionId = getSessionId();

  const { data: existing } = await supabase
    .from("cart_items")
    .select("*")
    .eq("session_id", sessionId)
    .eq("product_id", productId)
    .eq("size_id", sizeId)
    .eq("color_id", colorId)
    .maybeSingle();

  if (existing) {
    return await supabase
      .from("cart_items")
      .update({
        quantity: existing.quantity + quantity,
      })
      .eq("id", existing.id);
  }

  return await supabase.from("cart_items").insert({
    session_id: sessionId,
    product_id: productId,
    size_id: sizeId,
    color_id: colorId,
    quantity,
  });
}

export async function getCartCount() {
  const sessionId = getSessionId();

  const { count } = await supabase
    .from("cart_items")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("session_id", sessionId);

  return count ?? 0;
}