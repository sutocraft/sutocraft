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
  .select(`
    *,
    payments (
      id,
      order_id,
      payment_method,
      transaction_id,
      amount,
      status,
      rejection_reason,
      admin_note,
      submitted_at,
      approved_at,
      rejected_at,
      created_at
    )
  `)
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
// ============================================================
// LOCKED ORDER SYSTEM ACTIONS
// ============================================================

const LOCKED_ORDER_FLOW = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Completed",
] as const;

type LockedOrderStatus = (typeof LOCKED_ORDER_FLOW)[number];

function assertTransition(current: string, next: LockedOrderStatus) {
  const currentIndex = LOCKED_ORDER_FLOW.indexOf(
    current as LockedOrderStatus
  );
  const nextIndex = LOCKED_ORDER_FLOW.indexOf(next);

  if (currentIndex === -1 || nextIndex !== currentIndex + 1) {
    throw new Error(`Invalid order transition: ${current} → ${next}`);
  }
}

async function getActionUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Please login first.");
  return user;
}

async function addOrderHistory(
  orderId: string,
  status: string,
  changedBy: string,
  note: string
) {
  const { error } = await supabase
    .from("order_status_history")
    .insert({
      order_id: orderId,
      status,
      changed_by: changedBy,
      note,
    });

  if (error) throw error;
}

/** Customer submits or resubmits a payment transaction AFTER the order exists. */
export async function submitOrderPayment(
  orderId: string,
  transactionId: string
) {
  const user = await getActionUser();
  const cleanTransactionId = transactionId.trim();

  if (!orderId) throw new Error("Order ID is required.");
  if (!cleanTransactionId) throw new Error("Transaction ID is required.");

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id,user_id,status,payment_status,payment_method,total")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (orderError) throw orderError;
  if (!order) throw new Error("Order not found.");

  if (order.status !== "Pending") {
    throw new Error("Payment can only be submitted while the order is Pending.");
  }

  if (order.payment_status === "Approved") {
    throw new Error("Payment has already been approved.");
  }

  // The checkout already creates the payment row with status Pending.
  // We update that row instead of inserting a new "Submitted" status,
  // because the live payments_status_check constraint accepts Pending/
  // Approved/Rejected, not a separate Submitted value.
  const {
    data: payment,
    error: paymentReadError,
  } = await supabase
    .from("payments")
    .select("id,status,transaction_id,payment_method,amount")
    .eq("order_id", order.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (paymentReadError) throw paymentReadError;

  const now = new Date().toISOString();

  if (payment?.id) {
    if (
      payment.status !== "Rejected" &&
      payment.transaction_id?.trim()
    ) {
      throw new Error(
        "Payment has already been submitted and is waiting for admin verification."
      );
    }

    const { error: paymentUpdateError } = await supabase
      .from("payments")
      .update({
        transaction_id: cleanTransactionId,
        status: "Pending",
        submitted_at: now,
        rejection_reason: null,
        admin_note: null,
        rejected_at: null,
        rejected_by: null,
      })
      .eq("id", payment.id)
      .eq("order_id", order.id);

    if (paymentUpdateError) throw paymentUpdateError;
  } else {
    // Safe fallback for an order created before the payment row existed.
    const { error: paymentInsertError } = await supabase
      .from("payments")
      .insert({
        order_id: order.id,
        user_id: user.id,
        payment_method: order.payment_method,
        transaction_id: cleanTransactionId,
        amount: Number(order.total || 0),
        status: "Pending",
        submitted_at: now,
      });

    if (paymentInsertError) throw paymentInsertError;
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      payment_status: "Pending",
      rejection_reason: null,
      rejected_at: null,
      rejected_by: null,
      updated_at: now,
    })
    .eq("id", order.id)
    .eq("user_id", user.id)
    .eq("status", "Pending");

  if (updateError) throw updateError;

  await addOrderHistory(
    order.id,
    "Pending",
    user.id,
    "Customer submitted payment transaction for admin verification."
  );

  return { success: true };
}

/** Customer may cancel only before payment submission/approval. */
export async function cancelCustomerOrder(
  orderId: string,
  reason: string
) {
  const user = await getActionUser();
  const cleanReason = reason.trim();

  if (!orderId) throw new Error("Order ID is required.");
  if (!cleanReason) throw new Error("Cancellation reason is required.");

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id,user_id,status,payment_status")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (orderError) throw orderError;
  if (!order) throw new Error("Order not found.");

  if (order.status !== "Pending" || order.payment_status !== "Pending") {
    throw new Error("This order can no longer be cancelled by the customer.");
  }

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("orders")
    .update({
      status: "Cancelled",
      cancelled_at: now,
      cancelled_by: user.id,
      cancellation_reason: cleanReason,
      updated_at: now,
    })
    .eq("id", order.id)
    .eq("user_id", user.id)
    .eq("status", "Pending")
    .eq("payment_status", "Pending");

  if (error) throw error;

  await addOrderHistory(
    order.id,
    "Cancelled",
    user.id,
    `Customer cancelled the order: ${cleanReason}`
  );

  return { success: true };
}

/** Admin final approval: payment must already be approved. */
export async function finalApproveOrder(orderId: string) {
  const user = await getActionUser();

  const { data: order, error: readError } = await supabase
    .from("orders")
    .select("id,status,payment_status")
    .eq("id", orderId)
    .maybeSingle();

  if (readError) throw readError;
  if (!order) throw new Error("Order not found.");
  if (order.status !== "Pending") throw new Error("Order is not Pending.");
  if (order.payment_status !== "Approved") {
    throw new Error("Payment must be approved before final approval.");
  }

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("orders")
    .update({ status: "Confirmed", updated_at: now })
    .eq("id", order.id)
    .eq("status", "Pending")
    .eq("payment_status", "Approved");

  if (error) throw error;

  await addOrderHistory(
    order.id,
    "Confirmed",
    user.id,
    "Order finally approved by admin."
  );

  return { success: true };
}

/** Advance exactly one lifecycle step. Shipment metadata is required for Shipped. */
export async function advanceOrderStatus(
  orderId: string,
  nextStatus: Exclude<LockedOrderStatus, "Pending" | "Confirmed">,
  shipment?: {
    courierName: string;
    trackingNumber: string;
    estimatedDeliveryDate: string;
  }
) {
  const user = await getActionUser();

  const { data: order, error: readError } = await supabase
    .from("orders")
    .select("id,status,payment_status")
    .eq("id", orderId)
    .maybeSingle();

  if (readError) throw readError;
  if (!order) throw new Error("Order not found.");

  assertTransition(order.status, nextStatus);

  const now = new Date().toISOString();
  const update: Record<string, any> = {
    status: nextStatus,
    updated_at: now,
  };

  if (nextStatus === "Shipped") {
    if (!shipment?.courierName?.trim()) throw new Error("Courier name is required.");
    if (!shipment?.trackingNumber?.trim()) throw new Error("Tracking number is required.");
    if (!shipment?.estimatedDeliveryDate) {
      throw new Error("Estimated delivery date is required.");
    }

    update.courier_name = shipment.courierName.trim();
    update.tracking_number = shipment.trackingNumber.trim();
    update.estimated_delivery_date = shipment.estimatedDeliveryDate;
    update.shipped_at = now;
  }

  if (nextStatus === "Delivered") update.delivered_at = now;

  const { error } = await supabase
    .from("orders")
    .update(update)
    .eq("id", order.id)
    .eq("status", order.status);

  if (error) throw error;

  const notes: Record<LockedOrderStatus, string> = {
    Pending: "Order is pending.",
    Confirmed: "Order confirmed by admin.",
    Processing: "Order is being prepared.",
    Shipped: `Order shipped via ${shipment!.courierName.trim()} with tracking ${shipment!.trackingNumber.trim()}.`,
    Delivered: "Order marked as delivered by admin.",
    Completed: "Order completed by admin.",
  };

  await addOrderHistory(order.id, nextStatus, user.id, notes[nextStatus]);

  return { success: true };
}