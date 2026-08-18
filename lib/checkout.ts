import { supabase } from "./auth";

export type CheckoutItem = {
  product_id: string;
  quantity: number;
  price: number;
  product_name?: string;
  sku?: string | null;
  size_id?: string | null;
  discount?: number;
};

export type CheckoutData = {
  customer_name: string;
  phone: string;
  email?: string;
  address: string;

  subtotal: number;
  shipping: number;
  total: number;

  payment_method: string;
  transaction_id?: string | null;

  shipping_method?: string | null;
  shipping_charge?: number;

  discount?: number;

  /**
   * Clear the customer's cart after successful order creation.
   * Cart checkout: true
   * Buy Now: false
   */
  clear_cart?: boolean;

  items: CheckoutItem[];
};

async function generateOrderNumber() {
  const now = new Date();

  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  const datePart = `${yy}${mm}${dd}`;
  const prefix = `SC-${datePart}-`;

  const { data: existingOrders, error } = await supabase
    .from("orders")
    .select("order_number")
    .like("order_number", `${prefix}%`);

  if (error) {
    throw error;
  }

  let maxSerial = 0;

  const serialPattern = new RegExp(
    `^SC-${datePart}-(\\d{4})$`
  );

  for (const row of existingOrders ?? []) {
    const value = String(row.order_number ?? "");
    const match = value.match(serialPattern);

    if (match) {
      const serial = Number(match[1]);

      if (
        Number.isInteger(serial) &&
        serial > maxSerial
      ) {
        maxSerial = serial;
      }
    }
  }

  const nextSerial = maxSerial + 1;

  if (nextSerial > 9999) {
    throw new Error(
      "Daily order number limit reached. Please contact support."
    );
  }

  return `${prefix}${String(nextSerial).padStart(4, "0")}`;
}

export async function placeOrder(data: CheckoutData) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("Please login first.");
  }

  if (!data.items || data.items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  if (!data.customer_name.trim()) {
    throw new Error("Customer name is required.");
  }

  if (!data.phone.trim()) {
    throw new Error("Phone number is required.");
  }

  if (!data.address.trim()) {
    throw new Error("Delivery address is required.");
  }

  if (!data.payment_method.trim()) {
    throw new Error("Please select a payment method.");
  }


  const subtotal = Number(data.subtotal) || 0;
  const shipping = Number(data.shipping) || 0;
  const discount = Number(data.discount) || 0;
  const total = Number(data.total) || subtotal + shipping - discount;

/*
 * =====================================================
 * 1. CREATE ORDER
 * =====================================================
 *
 * Duplicate order number protection:
 * If two customers place an order at exactly the same
 * time, both may initially receive the same serial.
 *
 * PostgreSQL unique constraint will reject one of them.
 * We then generate the next number and retry.
 */

let order: any = null;
let orderError: any = null;

const MAX_ORDER_NUMBER_RETRIES = 5;

for (
  let attempt = 1;
  attempt <= MAX_ORDER_NUMBER_RETRIES;
  attempt++
) {
  const orderNumber = await generateOrderNumber();

  const result = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: user.id,

      customer_name: data.customer_name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || null,
      address: data.address.trim(),

      subtotal,
      shipping,
      total,
      discount,

      status: "Pending",
      payment_status: "Pending",
      payment_method: data.payment_method,

      shipping_method:
        data.shipping_method?.trim() || "Standard",

      shipping_charge:
        Number(data.shipping_charge) || shipping,
    })
    .select()
    .single();

  order = result.data;
  orderError = result.error;

  /*
   * SUCCESS
   */
  if (!orderError) {
    break;
  }

  /*
   * Only retry duplicate order_number errors.
   *
   * PostgreSQL unique violation:
   * 23505
   *
   * Constraint:
   * orders_order_number_key
   */
  const isDuplicateOrderNumber =
    orderError.code === "23505" &&
    (
      String(orderError.message || "").includes(
        "orders_order_number_key"
      ) ||
      String(orderError.details || "").includes(
        "order_number"
      )
    );

  if (!isDuplicateOrderNumber) {
    break;
  }

  /*
   * Another customer already took this number.
   * Wait very briefly and generate the next number.
   */
  await new Promise((resolve) =>
    setTimeout(resolve, 100)
  );
}

if (orderError || !order) {
  throw (
    orderError ||
    new Error("Unable to create order. Please try again.")
  );
}

  /*
 * =====================================================
 * 1B. CREATE INITIAL ORDER STATUS HISTORY
 * =====================================================
 */

const { error: historyError } = await supabase
  .from("order_status_history")
  .insert({
    order_id: order.id,
    status: "Pending",
    changed_by: user.id,
    note: "Order placed by customer. Waiting for admin review.",
  });

if (historyError) {
  // Roll back order if history cannot be created
  await supabase
    .from("orders")
    .delete()
    .eq("id", order.id)
    .eq("user_id", user.id);

  throw historyError;
}


  /*
   * =====================================================
   * 2. CREATE ORDER ITEMS
   * =====================================================
   */

  const orderItems = data.items.map((item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    const discountAmount = Number(item.discount) || 0;

    const lineTotal =
      price * quantity - discountAmount;

    return {
      order_id: order.id,

      product_id: item.product_id,

      product_name:
        item.product_name || null,

      sku:
        item.sku || null,

      size_id:
        item.size_id || null,

      quantity,

      price,

      unit_price: price,

      discount: discountAmount,

      line_total: Math.max(0, lineTotal),
    };
  });

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    // Best-effort cleanup
    await supabase
      .from("orders")
      .delete()
      .eq("id", order.id)
      .eq("user_id", user.id);

    throw itemsError;
  }

  /*
   * =====================================================
   * 3. CREATE INITIAL PAYMENT RECORD
   * =====================================================
   */

  const { error: paymentError } = await supabase
    .from("payments")
    .insert({
      order_id: order.id,
      user_id: user.id,

      payment_method:
        data.payment_method,

      transaction_id:
        data.transaction_id?.trim() || null,

      amount: total,

      status: "Pending",
    });

  if (paymentError) {
    // Best-effort cleanup
    await supabase
      .from("order_items")
      .delete()
      .eq("order_id", order.id);

    await supabase
      .from("orders")
      .delete()
      .eq("id", order.id)
      .eq("user_id", user.id);

    throw paymentError;
  }

  /*
   * =====================================================
   * 4. CLEAR CUSTOMER CART
   * =====================================================
   */

  if (data.clear_cart !== false) {
    const { error: cartError } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    if (cartError) {
      console.error(
        "Order created but cart could not be cleared:",
        cartError
      );
    }
  }

  /*
   * =====================================================
   * 5. RETURN ORDER
   * =====================================================
   */

  return order;
}