"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Clock3,
  CreditCard,
  Eye,
  RefreshCw,
  ShieldCheck,
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

  async function rejectPayment(order: Order) {
    try {
      setProcessingPayment(order.id);
      setError("");

      const payment = getPayment(order);

      if (!payment) {
        throw new Error(
          "No payment record found."
        );
      }

      const { error: paymentError } =
        await supabase
          .from("payments")
          .update({
            status: "Rejected",
            rejected_at:
              new Date().toISOString(),
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
            payment_status: "Rejected",
            status: "Rejected",
            updated_at:
              new Date().toISOString(),
          })
          .eq("id", order.id);

      if (orderError) {
        throw orderError;
      }

      await loadOrders(false);
    } catch (err: any) {
      console.error(
        "Payment rejection error:",
        err
      );

      setError(
        err?.message ||
          "Unable to reject payment."
      );
    } finally {
      setProcessingPayment(null);
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

                              {payment.status !==
                                "Approved" &&
                                payment.payment_method !==
                                  "Cash" && (
                                  <div className="flex flex-wrap gap-2 pt-2">
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

                                    <button
                                      type="button"
                                      onClick={() =>
                                        rejectPayment(
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

                      {/* FINAL APPROVAL */}
                      {order.status ===
                        "Pending" && (
                        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-[#E7D8BC] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-bold text-gray-900">
                              Final Order Approval
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              {paymentWaiting
                                ? "Verify the transaction ID before final approval."
                                : "Payment is ready. Approve this order to confirm it."}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              finalApproveOrder(
                                order
                              )
                            }
                            disabled={
                              processingApproval ===
                                order.id ||
                              paymentWaiting
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                            style={{
                              backgroundColor:
                                themeColor,
                            }}
                          >
                            <ShieldCheck
                              size={18}
                            />

                            {processingApproval ===
                            order.id
                              ? "Approving..."
                              : "Final Approve Order"}
                          </button>
                        </div>
                      )}

                      {order.status ===
                        "Confirmed" && (
                        <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
                          <Check size={18} />
                          Order has been finally approved.
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
    </main>
  );
}