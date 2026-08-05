import { supabase } from "./auth";

export type CheckoutItem = {
  product_id: string;
  quantity: number;
  price: number;
};

export type CheckoutData = {
  customer_name: string;
  phone: string;
  email: string;
  address: string;

  subtotal: number;
  shipping: number;
  total: number;

  items: CheckoutItem[];
};

export async function placeOrder(data: CheckoutData) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Please login first.");
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      customer_name: data.customer_name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      subtotal: data.subtotal,
      shipping: data.shipping,
      total: data.total,
      status: "Pending",
    })
    .select()
    .single();

  if (orderError) {
    throw orderError;
  }

    const orderItems = data.items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    throw itemsError;
  }

    const { error: cartError } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id);

  if (cartError) {
    throw cartError;
  }

  return order;
}