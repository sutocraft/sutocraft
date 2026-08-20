"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  CreditCard,
  Eye,
  RefreshCw,
  ShieldCheck,
  Truck,
  PackageCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { getCurrentUserProfile } from "@/lib/auth";
import { useTheme } from "@/app/components/website/settings.theme_color";

type Payment = {
  id: string;
  order_id: string;
  payment_method: string;
  transaction_id: string | null;
  amount: number;
  status: string;
  rejection_reason: string | null;
  admin_note: string | null;
  submitted_at: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  created_at: string;
};

type OrderItem = {
  id: string;
  product_id: string | null;
  product_name: string | null;
  sku: string | null;
  size_id: string | null;
  quantity: number | null;
  price: number | null;
  unit_price: number | null;
  discount: number | null;
  line_total: number | null;
};

type Order = {
  id: string;
  order_number: string | null;
  user_id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  subtotal: number | null;
  shipping: number | null;
  total: number | null;
  discount: number | null;
  status: string;
  payment_status: string | null;
  payment_method: string | null;
  shipping_method: string | null;
  shipping_charge: number | null;
  courier_name: string | null;
  tracking_number: string | null;
  estimated_delivery_date: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  cancelled_by: string | null;
  cancellation_reason: string | null;
  rejection_reason: string | null;
  rejected_at: string | null;
  rejected_by: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
  payments: Payment[];
};

function formatDate(value: string | null) {
  if (!value) return "N/A";

  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getPayment(order: Order) {
  if (!order.payments?.length) return null;

  return [...order.payments].sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  )[0];
}

export default function AdminOrdersPage() {
  const { themeColor } = useTheme();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [expandedOrder, setExpandedOrder] =
    useState<string | null>(null);

  const [processingPayment, setProcessingPayment] =
    useState<string | null>(null);

  const [processingApproval, setProcessingApproval] =
  useState<string | null>(null);

const [search, setSearch] = useState("");

const [rejectingOrder, setRejectingOrder] =
  useState<Order | null>(null);

const [rejectionReason, setRejectionReason] =
  useState("");

const [rejectModalError, setRejectModalError] =
  useState("");

const [lifecycleProcessing, setLifecycleProcessing] =
  useState<string | null>(null);

const [shippingOrder, setShippingOrder] =
  useState<Order | null>(null);

const [courierName, setCourierName] =
  useState("");

const [trackingNumber, setTrackingNumber] =
  useState("");

const [estimatedDeliveryDate, setEstimatedDeliveryDate] =
  useState("");

const [shippingModalError, setShippingModalError] =
  useState("");

  async function checkAdmin() {
    const profile = await getCurrentUserProfile();

    if (!profile) {
      throw new Error("Admin profile not found.");
    }

    if (
      profile.role !== "admin" &&
      profile.role !== "super_admin" &&
      profile.role !== "staff"
    ) {
      throw new Error("Access denied.");
    }
  }

  async function loadOrders(showLoader = true) {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      await checkAdmin();

      const { data, error: ordersError } =
        await supabase
          .from("orders")
          .select(
            `
              *,
              order_items (
                id,
                product_id,
                product_name,
                sku,
                size_id,
                quantity,
                price,
                unit_price,
                discount,
                line_total
              ),
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
            `
          )
          .order("created_at", {
            ascending: false,
          });

      if (ordersError) {
        throw ordersError;
      }

      setOrders((data || []) as Order[]);
    } catch (err: any) {
      console.error("Failed to load admin orders:", err);

      setError(
        err?.message ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadOrders();
    let active = true;
    const channel = supabase.channel("admin-orders-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, async () => {
        if (active) await loadOrders(false);
      })
      .subscribe();
    return () => { active = false; supabase.removeChannel(channel); };
  }, []);

  const filteredOrders = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    if (!keyword) {
      return orders;
    }

    return orders.filter((order) => {
      const orderNumber =
        order.order_number ||
        order.id;

      const payment =
        getPayment(order);

      return (
        orderNumber
          .toLowerCase()
          .includes(keyword) ||
        order.customer_name
          .toLowerCase()
          .includes(keyword) ||
        order.phone
          .toLowerCase()
          .includes(keyword) ||
        order.status
          .toLowerCase()
          .includes(keyword) ||
        (
          order.payment_status || ""
        )
          .toLowerCase()
          .includes(keyword) ||
        (
          payment?.transaction_id || ""
        )
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [orders, search]);

  async function verifyPayment(order: Order) {
    try {
      setProcessingPayment(order.id);
      setError("");

      const payment = getPayment(order);

      if (!payment) {
        throw new Error(
          "No payment record found."
        );
      }

      if (
        payment.payment_method !== "Cash" &&
        !payment.transaction_id?.trim()
      ) {
        throw new Error(
          "Transaction ID is missing."
        );
      }

      const now =
        new Date().toISOString();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error(
          "Admin session expired."
        );
      }

      const { error: paymentError } =
        await supabase
          .from("payments")
          .update({
            status: "Approved",
            approved_at: now,
            rejection_reason: null,
            admin_note:
              "Payment verified by admin.",
          })
          .eq("id", payment.id)
          .eq("order_id", order.id);

      if (paymentError) {
        throw paymentError;
      }

      const { error: orderError } =
        await supabase
          .from("orders")
          .update({
            payment_status: "Approved",
            updated_at: now,
          })
          .eq("id", order.id);

      if (orderError) {
        throw orderError;
      }

      await supabase
        .from("order_status_history")
        .insert({
          order_id: order.id,
          status: "Pending",
          changed_by: user.id,
          note:
            "Transaction ID verified. Waiting for final approval.",
        });

      await loadOrders(false);
    } catch (err: any) {
      console.error(
        "Payment verification error:",
        err
      );

      setError(
        err?.message ||
          "Unable to verify payment."
      );
    } finally {
      setProcessingPayment(null);
    }
  }

  async function finalApproveOrder(order: Order) {
    try {
      setProcessingApproval(order.id);
      setError("");

      if (
        order.payment_method !== "Cash" &&
        order.payment_status !== "Approved"
      ) {
        throw new Error(
          "Payment must be verified before final approval."
        );
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error(
          "Admin session expired."
        );
      }

      const now =
        new Date().toISOString();

      const { error: orderError } =
        await supabase
          .from("orders")
          .update({
            status: "Confirmed",
            updated_at: now,
          })
          .eq("id", order.id)
          .eq("status", "Pending");

      if (orderError) {
        throw orderError;
      }

      const { error: historyError } =
        await supabase
          .from("order_status_history")
          .insert({
            order_id: order.id,
            status: "Confirmed",
            changed_by: user.id,
            note:
              "Order finally approved by admin.",
          });

      if (historyError) {
        throw historyError;
      }

      await loadOrders(false);
    } catch (err: any) {
      console.error(
        "Final approval error:",
        err
      );

      setError(
        err?.message ||
          "Unable to approve order."
      );
    } finally {
      setProcessingApproval(null);
    }
  }

async function rejectPayment() {
  if (!rejectingOrder) return;

  const cleanReason = rejectionReason.trim();

  if (!cleanReason) {
    setRejectModalError("Rejection reason is required.");
    return;
  }

  try {
    setRejectModalError("");
    setProcessingPayment(rejectingOrder.id);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Admin session expired.");

    const payment = getPayment(rejectingOrder);
    if (!payment?.id) {
      throw new Error("Payment record not found for this order.");
    }

    const now = new Date().toISOString();

    const { error: paymentError } = await supabase
      .from("payments")
      .update({
        status: "Rejected",
        rejection_reason: cleanReason,
        admin_note: "Payment rejected by admin.",
        rejected_by: user.id,
        rejected_at: now,
      })
      .eq("id", payment.id)
      .eq("order_id", rejectingOrder.id);

    if (paymentError) throw paymentError;

    // LOCKED RULE:
    // Payment rejection never changes the main order status to Rejected.
    const { error: orderError } = await supabase
      .from("orders")
      .update({
        payment_status: "Rejected",
        rejection_reason: cleanReason,
        rejected_by: user.id,
        rejected_at: now,
        updated_at: now,
        status: "Pending",
      })
      .eq("id", rejectingOrder.id)
      .eq("status", "Pending");

    if (orderError) throw orderError;

    const { error: historyError } = await supabase
      .from("order_status_history")
      .insert({
        order_id: rejectingOrder.id,
        status: "Pending",
        changed_by: user.id,
        note: `Payment Rejected: ${cleanReason}`,
      });

    if (historyError) throw historyError;

    setRejectingOrder(null);
    setRejectionReason("");
    setRejectModalError("");

    await loadOrders(false);
  } catch (err: any) {
    console.error("Payment rejection error:", err);
    setRejectModalError(
      err?.message ||
      err?.error_description ||
      "Unable to reject payment."
    );
  } finally {
    setProcessingPayment(null);
  }
}

  function openRejectModal(order: Order) {
    setError("");
    setRejectionReason("");
    setRejectingOrder(order);
  }

  function closeRejectModal() {
    if (processingPayment) return;
    setRejectingOrder(null);
    setRejectionReason("");
  }

  async function transitionOrder(
    order: Order,
    nextStatus: string,
    note: string
  ) {
    try {
      setLifecycleProcessing(order.id);
      setError("");

      if (order.status === "Cancelled" || order.status === "Completed") {
        throw new Error(
          "This order is locked and cannot be modified."
        );
      }

      const allowed: Record<string, string[]> = {
        Confirmed: ["Processing"],
        Processing: ["Shipped"],
        Shipped: ["Delivered"],
        Delivered: ["Completed"],
      };

      if (!allowed[order.status]?.includes(nextStatus)) {
        throw new Error(
          `Invalid order transition: ${order.status} → ${nextStatus}.`
        );
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Admin session expired.");

      const now = new Date().toISOString();
      const update: Record<string, any> = {
        status: nextStatus,
        updated_at: now,
      };

      if (nextStatus === "Delivered") {
        update.delivered_at = now;
      }

      const { error: orderError } = await supabase
        .from("orders")
        .update(update)
        .eq("id", order.id)
        .eq("status", order.status);

      if (orderError) throw orderError;

      const { error: historyError } = await supabase
        .from("order_status_history")
        .insert({
          order_id: order.id,
          status: nextStatus,
          changed_by: user.id,
          note,
        });

      if (historyError) throw historyError;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        await fetch("/api/notifications/whatsapp/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
          },
          body: JSON.stringify({ orderId: order.id, status: nextStatus, note }),
        });
      } catch (notificationError) {
        console.error("WhatsApp notification failed:", notificationError);
      }

      await loadOrders(false);
    } catch (err: any) {
      console.error("Order lifecycle update error:", err);
      setError(
        err?.message || "Unable to update order status."
      );
    } finally {
      setLifecycleProcessing(null);
    }
  }

  function openShippingModal(order: Order) {
    setShippingOrder(order);
    setCourierName(order.courier_name || "");
    setTrackingNumber(order.tracking_number || "");
    setEstimatedDeliveryDate(order.estimated_delivery_date || "");
    setShippingModalError("");
  }

  function closeShippingModal() {
    if (lifecycleProcessing) return;
    setShippingOrder(null);
    setCourierName("");
    setTrackingNumber("");
    setEstimatedDeliveryDate("");
    setShippingModalError("");
  }

  async function shipOrder() {
    if (!shippingOrder) return;

    const courier = courierName.trim();
    const tracking = trackingNumber.trim();

    if (!courier || !tracking || !estimatedDeliveryDate) {
      setShippingModalError(
        "Courier, Tracking Number and Estimated Delivery Date are required."
      );
      return;
    }

    try {
      setLifecycleProcessing(shippingOrder.id);
      setShippingModalError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Admin session expired.");

      if (shippingOrder.status !== "Processing") {
        throw new Error(
          `Invalid order transition: ${shippingOrder.status} → Shipped.`
        );
      }

      const now = new Date().toISOString();

      const { error: orderError } = await supabase
        .from("orders")
        .update({
          status: "Shipped",
          courier_name: courier,
          tracking_number: tracking,
          estimated_delivery_date: estimatedDeliveryDate,
          shipped_at: now,
          updated_at: now,
        })
        .eq("id", shippingOrder.id)
        .eq("status", "Processing");

      if (orderError) throw orderError;

      const { error: historyError } = await supabase
        .from("order_status_history")
        .insert({
          order_id: shippingOrder.id,
          status: "Shipped",
          changed_by: user.id,
          note: `Order shipped via ${courier}. Tracking: ${tracking}. Estimated delivery: ${estimatedDeliveryDate}.`,
        });

      if (historyError) throw historyError;

      closeShippingModal();
      await loadOrders(false);
    } catch (err: any) {
      console.error("Shipping update error:", err);
      setShippingModalError(
        err?.message || "Unable to ship this order."
      );
    } finally {
      setLifecycleProcessing(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F4EC] px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1
              className="text-3xl font-bold sm:text-4xl"
              style={{
                color: themeColor,
              }}
            >
              Orders
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Manage customer orders, payment verification
              and final approval.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              loadOrders(false)
            }
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-5 py-3 text-sm font-semibold transition hover:bg-gray-50 disabled:opacity-50"
            style={{
              borderColor: `${themeColor}45`,
              color: themeColor,
            }}
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>
        </div>

        {/* SEARCH */}
        <div className="mb-6 rounded-2xl border border-[#E7D8BC] bg-white p-5 shadow-sm">
          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search order number, customer, phone, transaction ID..."
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none"
            onFocus={(e) => {
              e.currentTarget.style.borderColor =
                themeColor;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor =
                "#D1D5DB";
            }}
          />
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <XCircle
              size={18}
              className="mt-0.5 shrink-0"
            />
            <span>{error}</span>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="rounded-2xl border border-[#E7D8BC] bg-white p-20 text-center">
            <div
              className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200"
              style={{
                borderTopColor: themeColor,
              }}
            />

            <p className="mt-4 text-sm text-gray-600">
              Loading orders...
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-[#E7D8BC] bg-white p-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <CreditCard
                size={28}
                className="text-gray-400"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              No Orders Found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              There are no orders matching your search.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const payment =
                getPayment(order);

              const expanded =
                expandedOrder ===
                order.id;

              const lifecycleStatus =
                String(order.status || "")
                  .trim()
                  .toLowerCase();

              const cancelled =
                lifecycleStatus === "cancelled";

              const paymentWaiting =
                order.payment_method !==
                  "Cash" &&
                order.payment_status !==
                  "Approved";

              const waitingForFinalApproval =
                order.status === "Pending" &&
                !paymentWaiting;

              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-[#E7D8BC] bg-white shadow-sm"
                >
                  {/* ORDER HEADER */}
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <div>
                          <p className="text-xs font-medium text-gray-500">
                            Order Number
                          </p>

                          <p
                            className="mt-1 font-bold"
                            style={{
                              color: themeColor,
                            }}
                          >
                            {order.order_number ||
                              order.id}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-500">
                            Customer
                          </p>

                          <p className="mt-1 font-semibold text-gray-900">
                            {order.customer_name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {order.phone}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-500">
                            Total
                          </p>

                          <p
                            className="mt-1 font-bold"
                            style={{
                              color: themeColor,
                            }}
                          >
                            ৳{" "}
                            {Number(
                              order.total || 0
                            ).toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-500">
                            Payment
                          </p>

                          <p className="mt-1 font-semibold text-gray-900">
                            {order.payment_method ||
                              "N/A"}
                          </p>

                          <p className="text-xs text-gray-500">
                            {order.payment_status ||
                              "Pending"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-500">
                            Status
                          </p>

                          <span
                            className="mt-1 inline-flex rounded-full px-3 py-1 text-xs font-bold"
                            style={{
                              backgroundColor:
                                order.status ===
                                "Confirmed"
                                  ? `${themeColor}18`
                                  : "#FEF3C7",
                              color:
                                order.status ===
                                "Confirmed"
                                  ? themeColor
                                  : "#B45309",
                            }}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedOrder(
                            expanded
                              ? null
                              : order.id
                          )
                        }
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition"
                        style={{
                          borderColor:
                            themeColor,
                          color: themeColor,
                        }}
                      >
                        <Eye size={17} />

                        {expanded
                          ? "Hide Details"
                          : "View Details"}
                      </button>
                    </div>
                  </div>

                  {/* DETAILS */}
                  {expanded && (
                    <div className="border-t border-[#E7D8BC] bg-[#FCFAF6] p-5 sm:p-6">
                      <div className="grid gap-6 lg:grid-cols-2">
                        {/* CUSTOMER */}
                        <div className="rounded-xl border border-[#E7D8BC] bg-white p-5">
                          <h3
                            className="font-bold"
                            style={{
                              color: themeColor,
                            }}
                          >
                            Customer Information
                          </h3>

                          <div className="mt-4 space-y-2 text-sm">
                            <p>
                              <strong>
                                Name:
                              </strong>{" "}
                              {order.customer_name}
                            </p>

                            <p>
                              <strong>
                                Phone:
                              </strong>{" "}
                              {order.phone}
                            </p>

                            {order.email && (
                              <p>
                                <strong>
                                  Email:
                                </strong>{" "}
                                {order.email}
                              </p>
                            )}

                            <p>
                              <strong>
                                Address:
                              </strong>{" "}
                              {order.address}
                            </p>

                            <p>
                              <strong>
                                Date:
                              </strong>{" "}
                              {formatDate(
                                order.created_at
                              )}
                            </p>
                          </div>
                        </div>

                        {/* PAYMENT */}
                        <div className="rounded-xl border border-[#E7D8BC] bg-white p-5">
                          <h3
                            className="font-bold"
                            style={{
                              color: themeColor,
                            }}
                          >
                            Payment Verification
                          </h3>

                          {payment ? (
                            <div className="mt-4 space-y-3 text-sm">
                              <p>
                                <strong>
                                  Method:
                                </strong>{" "}
                                {
                                  payment.payment_method
                                }
                              </p>

                              <p>
                                <strong>
                                  Amount:
                                </strong>{" "}
                                ৳{" "}
                                {Number(
                                  payment.amount ||
                                    0
                                ).toLocaleString()}
                              </p>

                              <p>
                                <strong>
                                  Transaction ID:
                                </strong>{" "}
                                {payment.transaction_id ||
                                  "Not provided"}
                              </p>

                              <p>
                                <strong>
                                  Payment Status:
                                </strong>{" "}
                                {payment.status}
                              </p>

                              {payment.rejection_reason && (
                                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-3">
                                  <p className="text-xs font-bold uppercase tracking-wide text-red-600">
                                    Rejection Reason
                                  </p>
                                  <p className="mt-1 text-sm text-red-700">
                                    {payment.rejection_reason}
                                  </p>
                                </div>
                              )}

                              {payment.status !==
                                "Approved" && (
                                  <div className="flex flex-wrap gap-2 pt-2">
                                    {payment.payment_method !==
                                      "Cash" && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          verifyPayment(
                                            order
                                          )
                                        }
                                        disabled={
                                          processingPayment ===
                                          order.id
                                        }
                                        className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                                        style={{
                                          backgroundColor:
                                            themeColor,
                                        }}
                                      >
                                        <ShieldCheck
                                          size={16}
                                        />

                                        {processingPayment ===
                                        order.id
                                          ? "Verifying..."
                                          : "Verify Payment"}
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() =>
                                        openRejectModal(
                                          order
                                        )
                                      }
                                      disabled={
                                        processingPayment ===
                                        order.id
                                      }
                                      className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 disabled:opacity-50"
                                    >
                                      <XCircle
                                        size={16}
                                      />
                                      Reject
                                    </button>
                                  </div>
                                )}

                              {payment.status ===
                                "Approved" && (
                                <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
                                  <Check
                                    size={16}
                                  />
                                  Payment Verified
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="mt-4 text-sm text-gray-500">
                              No payment record found.
                            </p>
                          )}
                        </div>
                      </div>

                      {(order.status === "Shipped" ||
                        order.status === "Delivered" ||
                        order.status === "Completed") && (
                        <div className="mt-6 rounded-xl border border-[#E7D8BC] bg-white p-5">
                          <h3
                            className="font-bold"
                            style={{ color: themeColor }}
                          >
                            Shipment Information
                          </h3>
                          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                            <p>
                              <strong>Courier:</strong>{" "}
                              {order.courier_name || "N/A"}
                            </p>
                            <p>
                              <strong>Tracking:</strong>{" "}
                              {order.tracking_number || "N/A"}
                            </p>
                            <p>
                              <strong>ETA:</strong>{" "}
                              {order.estimated_delivery_date || "N/A"}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* PRODUCTS */}
                      <div className="mt-6 rounded-xl border border-[#E7D8BC] bg-white p-5">
                        <h3
                          className="font-bold"
                          style={{
                            color: themeColor,
                          }}
                        >
                          Ordered Products
                        </h3>

                        <div className="mt-4 overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead
                              style={{
                                backgroundColor:
                                  `${themeColor}08`,
                              }}
                            >
                              <tr>
                                <th
                                  className="px-4 py-3 text-left"
                                  style={{
                                    color:
                                      themeColor,
                                  }}
                                >
                                  Product
                                </th>

                                <th
                                  className="px-4 py-3 text-center"
                                  style={{
                                    color:
                                      themeColor,
                                  }}
                                >
                                  Qty
                                </th>

                                <th
                                  className="px-4 py-3 text-right"
                                  style={{
                                    color:
                                      themeColor,
                                  }}
                                >
                                  Price
                                </th>

                                <th
                                  className="px-4 py-3 text-right"
                                  style={{
                                    color:
                                      themeColor,
                                  }}
                                >
                                  Total
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {order.order_items?.map(
                                (item) => (
                                  <tr
                                    key={item.id}
                                    className="border-t border-[#E7D8BC]"
                                  >
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                      {item.product_name ||
                                        "Product"}
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                      {item.quantity ||
                                        0}
                                    </td>

                                    <td className="px-4 py-3 text-right">
                                      ৳{" "}
                                      {Number(
                                        item.unit_price ??
                                          item.price ??
                                          0
                                      ).toLocaleString()}
                                    </td>

                                    <td className="px-4 py-3 text-right font-semibold">
                                      ৳{" "}
                                      {Number(
                                        item.line_total ??
                                          Number(
                                            item.unit_price ??
                                              item.price ??
                                              0
                                          ) *
                                            Number(
                                              item.quantity ||
                                                0
                                            )
                                      ).toLocaleString()}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* LOCKED ORDER LIFECYCLE */}
                      {lifecycleStatus === "pending" && !cancelled && (
                        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-[#E7D8BC] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-bold text-gray-900">
                              Final Order Approval
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {paymentWaiting
                                ? "Payment must be approved before the order can be confirmed."
                                : "Payment is ready. Approve this order to confirm it."}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => finalApproveOrder(order)}
                            disabled={
                              processingApproval === order.id ||
                              paymentWaiting
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                            style={{ backgroundColor: themeColor }}
                          >
                            <ShieldCheck size={18} />
                            {processingApproval === order.id
                              ? "Approving..."
                              : "Confirm Order"}
                          </button>
                        </div>
                      )}

                      {lifecycleStatus === "confirmed" && !cancelled && (
                        <div className="mt-6 rounded-xl border border-[#E7D8BC] bg-white p-5">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-bold text-gray-900">
                                Order Confirmed
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                Payment is approved and the order is ready for processing.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                transitionOrder(
                                  order,
                                  "Processing",
                                  "Order moved to Processing by admin."
                                )
                              }
                              disabled={lifecycleProcessing === order.id}
                              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
                              style={{ backgroundColor: themeColor }}
                            >
                              <PackageCheck size={18} />
                              {lifecycleProcessing === order.id
                                ? "Updating..."
                                : "Start Processing"}
                            </button>
                          </div>
                        </div>
                      )}

                      {lifecycleStatus === "processing" && !cancelled && (
                        <div className="mt-6 rounded-xl border border-[#E7D8BC] bg-white p-5">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-bold text-gray-900">
                                Order Processing
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                The order is being prepared for shipment.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => openShippingModal(order)}
                              disabled={lifecycleProcessing === order.id}
                              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
                              style={{ backgroundColor: themeColor }}
                            >
                              <Truck size={18} />
                              Ship Order
                            </button>
                          </div>
                        </div>
                      )}

                      {lifecycleStatus === "shipped" && !cancelled && (
                        <div className="mt-6 rounded-xl border border-[#E7D8BC] bg-white p-5">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-bold text-gray-900">
                                Order Shipped
                              </p>
                              <div className="mt-2 grid gap-1 text-sm text-gray-600">
                                <span>
                                  <strong>Courier:</strong> {order.courier_name || "N/A"}
                                </span>
                                <span>
                                  <strong>Tracking:</strong> {order.tracking_number || "N/A"}
                                </span>
                                <span>
                                  <strong>ETA:</strong> {order.estimated_delivery_date || "N/A"}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                transitionOrder(
                                  order,
                                  "Delivered",
                                  "Order marked as Delivered by admin."
                                )
                              }
                              disabled={lifecycleProcessing === order.id}
                              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
                              style={{ backgroundColor: themeColor }}
                            >
                              <PackageCheck size={18} />
                              {lifecycleProcessing === order.id
                                ? "Updating..."
                                : "Mark Delivered"}
                            </button>
                          </div>
                        </div>
                      )}

                      {lifecycleStatus === "delivered" && !cancelled && (
                        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-bold text-green-800">
                                Order Delivered
                              </p>
                              <p className="mt-1 text-sm text-green-700">
                                Delivery has been recorded.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                transitionOrder(
                                  order,
                                  "Completed",
                                  "Order completed by admin after delivery."
                                )
                              }
                              disabled={lifecycleProcessing === order.id}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
                            >
                              <CheckCircle2 size={18} />
                              {lifecycleProcessing === order.id
                                ? "Updating..."
                                : "Complete Order"}
                            </button>
                          </div>
                        </div>
                      )}

                      {cancelled && (
                        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
                          Order Cancelled. This order is locked and no admin action is available.
                        </div>
                      )}

                      {lifecycleStatus === "completed" && !cancelled && (
                        <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
                          <CheckCircle2 size={18} />
                          Order completed. This order is now locked.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {shippingOrder && (
        <div
          className="fixed inset-0 z-[210] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ship-order-title"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#E7D8BC] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E7D8BC] px-5 py-4">
              <div>
                <h2
                  id="ship-order-title"
                  className="text-xl font-bold"
                  style={{ color: themeColor }}
                >
                  Ship Order
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {shippingOrder.order_number || shippingOrder.id}
                </p>
              </div>
              <button
                type="button"
                onClick={closeShippingModal}
                disabled={!!lifecycleProcessing}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DCCEB6] text-gray-600 hover:bg-[#F8F4EC] disabled:opacity-50"
                aria-label="Close shipping dialog"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#183153]">
                  Courier Name <span className="text-red-600">*</span>
                </label>
                <input
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  placeholder="Courier name"
                  className="w-full rounded-xl border border-[#DCCEB6] px-4 py-3 text-sm outline-none focus:border-[#A8741A]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#183153]">
                  Tracking Number <span className="text-red-600">*</span>
                </label>
                <input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Tracking number"
                  className="w-full rounded-xl border border-[#DCCEB6] px-4 py-3 text-sm outline-none focus:border-[#A8741A]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#183153]">
                  Estimated Delivery <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  value={estimatedDeliveryDate}
                  onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                  className="w-full rounded-xl border border-[#DCCEB6] px-4 py-3 text-sm outline-none focus:border-[#A8741A]"
                />
              </div>

              {shippingModalError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {shippingModalError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeShippingModal}
                  disabled={!!lifecycleProcessing}
                  className="rounded-xl border border-[#DCCEB6] bg-white px-5 py-3 text-sm font-semibold text-[#183153] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={shipOrder}
                  disabled={!!lifecycleProcessing}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                  style={{ backgroundColor: themeColor }}
                >
                  <Truck size={17} />
                  {lifecycleProcessing ? "Shipping..." : "Confirm Shipment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {rejectingOrder && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reject-payment-title"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#E7D8BC] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E7D8BC] px-5 py-4">
              <div>
                <h2
                  id="reject-payment-title"
                  className="text-xl font-bold"
                  style={{ color: themeColor }}
                >
                  Reject Payment
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {rejectingOrder.order_number || rejectingOrder.id}
                </p>
              </div>

              <button
                type="button"
                onClick={closeRejectModal}
                disabled={!!processingPayment}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DCCEB6] text-gray-600 transition hover:bg-[#F8F4EC] disabled:opacity-50"
                aria-label="Close rejection dialog"
              >
                ×
              </button>
            </div>

            <div className="p-5">
              <div className="mb-4 rounded-xl bg-[#F8F4EC] p-4 text-sm text-gray-700">
                <p><strong>Customer:</strong> {rejectingOrder.customer_name}</p>
                <p className="mt-1"><strong>Payment:</strong> {rejectingOrder.payment_method || "N/A"}</p>
                <p className="mt-1"><strong>Amount:</strong> ৳ {Number(rejectingOrder.total || 0).toLocaleString()}</p>
              </div>

              <label
                htmlFor="payment-rejection-reason"
                className="mb-2 block text-sm font-semibold text-[#183153]"
              >
                Rejection Reason <span className="text-red-600">*</span>
              </label>

              <textarea
                id="payment-rejection-reason"
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter the reason for rejecting this payment..."
                disabled={!!processingPayment}
                className="w-full resize-none rounded-xl border border-[#DCCEB6] bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#A8741A] focus:ring-4 focus:ring-[#A8741A]/15 disabled:bg-gray-100"
                autoFocus
              />

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeRejectModal}
                  disabled={!!processingPayment}
                  className="rounded-xl border border-[#DCCEB6] bg-white px-5 py-3 text-sm font-semibold text-[#183153] transition hover:bg-[#F8F4EC] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={rejectPayment}
                  disabled={!!processingPayment || !rejectionReason.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <XCircle size={17} />
                  {processingPayment ? "Rejecting..." : "Reject Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}