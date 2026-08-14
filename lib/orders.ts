import { supabase } from "./supabase";

async function getCurrentUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

export async function getOrdersCount() {
  const userId = await getCurrentUserId();

  if (!userId) return 0;

  const { count, error } = await supabase
    .from("orders")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    return 0;
  }

  return count ?? 0;
}

export async function getOrders() {
  const userId = await getCurrentUserId();

  if (!userId) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data ?? [];
}

export async function getOrderById(orderId: string) {
  const userId = await getCurrentUserId();

  if (!userId || !orderId) return null;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", userId)
    .maybeSingle();

  if (orderError) throw orderError;
  if (!order) return null;

  /*
   * IMPORTANT:
   * order_items does NOT have created_at in this project.
   * Therefore do not order this query by created_at.
   */
  const { data: orderItems, error: itemsError } = await supabase
    .from("order_items")
    .select(`
      *,
      sizes (
        id,
        name
      ),
      products (
        id,
        name,
        slug,
        image_url,
        sku
      )
    `)
    .eq("order_id", order.id);

  if (itemsError) throw itemsError;

  const productIds = (orderItems ?? [])
    .map((item: any) => item.product_id)
    .filter(Boolean);

  let imagesByProduct: Record<string, string> = {};

  if (productIds.length > 0) {
    const { data: images, error: imagesError } = await supabase
      .from("product_images")
      .select("product_id,image_url,is_primary,sort_order")
      .in("product_id", productIds)
      .order("is_primary", { ascending: false })
      .order("sort_order", { ascending: true });

    if (imagesError) throw imagesError;

    for (const image of images ?? []) {
      if (!imagesByProduct[image.product_id]) {
        imagesByProduct[image.product_id] = image.image_url;
      }
    }
  }

  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .select("*")
    .eq("order_id", order.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (paymentError) throw paymentError;

  const { data: statusHistory, error: historyError } = await supabase
    .from("order_status_history")
    .select("*")
    .eq("order_id", order.id)
    .order("created_at", { ascending: true });

  if (historyError) throw historyError;

  return {
  ...order,

  order_items: (orderItems ?? []).map((item: any) => ({
    ...item,

    id: item.id,
    product_id: item.product_id,
    product_name:
      item.product_name ||
      item.products?.name ||
      "Product",

    sku:
      item.sku ||
      item.products?.sku ||
      null,

    qty: item.quantity,
    quantity: item.quantity,

    price: Number(
      item.price ??
      item.unit_price ??
      0
    ),

    unit_price: Number(
      item.unit_price ??
      item.price ??
      0
    ),

    discount: Number(
      item.discount ?? 0
    ),

    line_total: Number(
      item.line_total ??
      (
        Number(item.unit_price ?? item.price ?? 0) *
        Number(item.quantity ?? 0)
      )
    ),

    image:
      imagesByProduct[item.product_id] ||
      item.products?.image_url ||
      "/images/no-image.png",

    size:
      item.sizes?.name ||
      null,

    size_id:
      item.size_id ||
      null,

    products:
      item.products
        ? {
            ...item.products,
          }
        : null,
  })),

  payments: payment
    ? [payment]
    : [],

  order_status_history:
    statusHistory ?? [],
};
}