import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";

export async function getProductReviewSummary(sku: string) {
  const cleanSku = String(sku || "").trim();

  if (!cleanSku) return { average: 0, count: 0 };

  const { data, error } = await supabase
    .from("product_reviews")
    .select("rating")
    .eq("sku", cleanSku)
    .eq("status", "approved");

  if (error) throw error;

  const ratings = (data || []).map((r: any) => Number(r.rating || 0));

  if (!ratings.length) {
    return { average: 0, count: 0 };
  }

  return {
    average:
      Math.round(
        (ratings.reduce((sum, value) => sum + value, 0) /
          ratings.length) *
          10
      ) / 10,
    count: ratings.length,
  };
}

export async function getProductReviewsBySku(sku: string) {
  const cleanSku = String(sku || "").trim();

  if (!cleanSku) return [];

  const { data, error } = await supabase
    .from("product_reviews")
    .select(
      "id, product_id, sku, order_id, customer_id, name, rating, comment, created_at"
    )
    .eq("sku", cleanSku)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function submitProductReview(params: {
  orderId: string;
  productId: string;
  sku: string;
  rating: number;
  comment: string;
}) {
  const user = await getCurrentUser();

  if (!user?.id) {
    throw new Error("Please login to submit a review.");
  }

  const sku = String(params.sku || "").trim();
  const comment = String(params.comment || "").trim();
  const rating = Math.max(1, Math.min(5, Number(params.rating || 0)));

  if (!sku) {
    throw new Error("Product SKU is missing.");
  }

  if (!comment) {
    throw new Error("Please write your review.");
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, user_id, status")
    .eq("id", params.orderId)
    .maybeSingle();

  if (orderError || !order) {
    throw new Error("Order could not be verified.");
  }

  if (
    order.user_id !== user.id ||
    String(order.status).toLowerCase() !== "completed"
  ) {
    throw new Error(
      "Review is available only for your completed orders."
    );
  }

  const { data: item, error: itemError } = await supabase
    .from("order_items")
    .select("id, product_id, sku")
    .eq("order_id", params.orderId)
    .eq("sku", sku)
    .maybeSingle();

  if (itemError || !item) {
    throw new Error(
      "This product is not part of the selected order."
    );
  }

  const { data: existing, error: existingError } = await supabase
    .from("product_reviews")
    .select("id")
    .eq("customer_id", user.id)
    .eq("order_id", params.orderId)
    .eq("sku", sku)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existing) {
    throw new Error(
      "You have already reviewed this product for this order."
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const { error } = await supabase
    .from("product_reviews")
    .insert({
      order_id: params.orderId,
      product_id: item.product_id || params.productId,
      sku,
      customer_id: user.id,
      name:
        profile?.full_name ||
        user.user_metadata?.full_name ||
        "Customer",
      rating,
      comment,
      status: "approved",
    });

  if (error) {
    throw error;
  }
}