"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  Truck,
  XCircle,
} from "lucide-react";

import { getOrderById } from "@/lib/orders";
import { useTheme } from "@/app/components/website/settings.theme_color";

type StatusHistory = {
  id: string;
  status: string;
  changed_by: string | null;
  note: string | null;
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

  products:
    | {
        id: string;
        name: string;
        slug: string;
        image_url: string | null;
      }
    | null;
};

type Payment = {
  id: string;
  payment_method: string;
  transaction_id: string | null;
  amount: number;
  status: string;
  rejection_reason: string | null;
  admin_note: string | null;
  submitted_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  created_at: string;
};

type Order = {
  id: string;
  order_number: string | null;

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

  estimated_delivery_date: string | null;
  shipping_method: string | null;
  shipping_charge: number | null;

  courier_name: string | null;
  tracking_number: string | null;

  shipped_at: string | null;
  delivered_at: string | null;

  cancellation_reason: string | null;
  rejection_reason: string | null;

  created_at: string;
  updated_at: string;

  order_items: OrderItem[];
  payments: Payment[];
  order_status_history: StatusHistory[];
};

const STATUS_ORDER = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
];

function formatDate(
  value: string | null
) {
  if (!value) return "N/A";

  return new Date(value).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function formatDateTime(
  value: string | null
) {
  if (!value) return "N/A";

  return new Date(value).toLocaleString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function getStatusIcon(
  status: string,
  currentStatus: string,
  themeColor: string
) {
  const currentIndex =
    STATUS_ORDER.indexOf(currentStatus);

  const statusIndex =
    STATUS_ORDER.indexOf(status);

  if (
    statusIndex !== -1 &&
    currentIndex !== -1 &&
    statusIndex <= currentIndex
  ) {
    return (
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full text-white"
        style={{
          backgroundColor: themeColor,
        }}
      >
        <Check size={18} />
      </div>
    );
  }

  if (status === "Cancelled") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
        <XCircle size={19} />
      </div>
    );
  }

  if (status === "Rejected") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
        <XCircle size={19} />
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400">
      <Clock3 size={18} />
    </div>
  );
}

function getPaymentStatusStyle(
  status: string | null
) {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-700";

    case "Submitted":
      return "bg-blue-100 text-blue-700";

    case "Rejected":
      return "bg-red-100 text-red-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

export default function OrderDetailsPage() {
  const params = useParams();
  const { themeColor } = useTheme();

  const orderId = params?.id as string;

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getOrderById(orderId);

        setOrder(data as Order);
      } catch (err: any) {
        console.error(
          "Failed to load order:",
          err
        );

        setError(
          err?.message ||
            "Unable to load this order."
        );
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const latestPayment = useMemo(() => {
    if (
      !order?.payments ||
      order.payments.length === 0
    ) {
      return null;
    }

    return [...order.payments].sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )[0];
  }, [order]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F4EC] py-10">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
          <div className="text-center">
            <div
              className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200"
              style={{
                borderTopColor: themeColor,
              }}
            />

            <p className="mt-4 text-[#4B5563]">
              Loading order details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#F8F4EC] py-10">
        <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
          <div className="text-6xl">
            📦
          </div>

          <h1
            className="mt-5 text-3xl font-bold"
            style={{
              color: themeColor,
            }}
          >
            Order Not Found
          </h1>

          <p className="mt-3 text-[#4B5563]">
            {error ||
              "This order could not be found."}
          </p>

          <Link
            href="/account/orders"
            className="mt-7 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white"
            style={{
              backgroundColor: themeColor,
            }}
          >
            <ArrowLeft size={17} />
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F4EC] py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1
              className="text-4xl font-bold sm:text-5xl"
              style={{
                color: themeColor,
              }}
            >
              Order Details
            </h1>

            <p className="mt-2 text-[#4B5563]">
              Order #
              <span className="font-semibold">
                {order.order_number ||
                  order.id}
              </span>
            </p>
          </div>

          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3 font-medium transition hover:text-white"
            style={{
              borderColor:
                `${themeColor}45`,
              color: themeColor,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                themeColor;
              e.currentTarget.style.color =
                "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "#FFFFFF";
              e.currentTarget.style.color =
                themeColor;
            }}
          >
            <ArrowLeft size={17} />
            Back to Orders
          </Link>
        </div>

        <div className="grid gap-7 lg:grid-cols-3">
          {/* LEFT */}
          <div className="space-y-7 lg:col-span-2">
            {/* Status Timeline */}
            <div className="rounded-2xl border border-[#E7D8BC] bg-white p-6 shadow-md sm:p-7">
              <div className="flex items-center gap-3">
                <Package
                  size={25}
                  style={{
                    color: themeColor,
                  }}
                />

                <h2
                  className="text-2xl font-bold"
                  style={{
                    color: themeColor,
                  }}
                >
                  Order Status
                </h2>
              </div>

              <div className="mt-7">
                {order.order_status_history?.length >
                0 ? (
                  <div className="space-y-5">
                    {[
                      ...order.order_status_history,
                    ]
                      .sort(
                        (a, b) =>
                          new Date(
                            a.created_at
                          ).getTime() -
                          new Date(
                            b.created_at
                          ).getTime()
                      )
                      .map(
                        (
                          history,
                          index
                        ) => (
                          <div
                            key={
                              history.id
                            }
                            className="flex gap-4"
                          >
                            <div className="flex flex-col items-center">
                              {getStatusIcon(
                                history.status,
                                order.status,
                                themeColor
                              )}

                              {index <
                                order
                                  .order_status_history
                                  .length -
                                  1 && (
                                <div
                                  className="mt-2 h-full min-h-8 w-px"
                                  style={{
                                    backgroundColor:
                                      `${themeColor}35`,
                                  }}
                                />
                              )}
                            </div>

                            <div className="flex-1 pb-3">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h3
                                  className="font-bold"
                                  style={{
                                    color:
                                      themeColor,
                                  }}
                                >
                                  {
                                    history.status
                                  }
                                </h3>

                                <span className="text-xs text-gray-400">
                                  {formatDateTime(
                                    history.created_at
                                  )}
                                </span>
                              </div>

                              {history.note && (
                                <p className="mt-1 text-sm text-[#4B5563]">
                                  {
                                    history.note
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      )}
                  </div>
                ) : (
                  <div className="rounded-xl bg-gray-50 p-5 text-sm text-gray-500">
                    No status history available.
                  </div>
                )}
              </div>
            </div>

            {/* Products */}
            <div className="rounded-2xl border border-[#E7D8BC] bg-white p-6 shadow-md sm:p-7">
              <h2
                className="text-2xl font-bold"
                style={{
                  color: themeColor,
                }}
              >
                Ordered Products
              </h2>

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full">
                  <thead
                    style={{
                      backgroundColor:
                        `${themeColor}08`,
                    }}
                  >
                    <tr>
                      <th
                        className="px-5 py-4 text-left font-semibold"
                        style={{
                          color: themeColor,
                        }}
                      >
                        Product
                      </th>

                      <th
                        className="px-5 py-4 text-center font-semibold"
                        style={{
                          color: themeColor,
                        }}
                      >
                        Qty
                      </th>

                      <th
                        className="px-5 py-4 text-right font-semibold"
                        style={{
                          color: themeColor,
                        }}
                      >
                        Price
                      </th>

                      <th
                        className="px-5 py-4 text-right font-semibold"
                        style={{
                          color: themeColor,
                        }}
                      >
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {order.order_items?.map(
                      (item) => {
                        const unitPrice =
                          Number(
                            item.unit_price ??
                              item.price ??
                              0
                          );

                        const quantity =
                          Number(
                            item.quantity ||
                              0
                          );

                        const lineTotal =
                          Number(
                            item.line_total ??
                              unitPrice *
                                quantity
                          );

                        const image =
                          item.products
                            ?.image_url ||
                          "/placeholder-product.jpg";

                        return (
                          <tr
                            key={item.id}
                            className="border-t border-[#E7D8BC]"
                          >
                            <td className="px-5 py-5">
                              <div className="flex items-center gap-4">
                                <img
                                  src={image}
                                  alt={
                                    item.product_name ||
                                    "Product"
                                  }
                                  className="h-20 w-16 rounded-lg border border-[#E7D8BC] object-cover"
                                />

                                <div>
                                  <h3
                                    className="font-bold"
                                    style={{
                                      color:
                                        themeColor,
                                    }}
                                  >
                                    {item.product_name ||
                                      item
                                        .products
                                        ?.name ||
                                      "Product"}
                                  </h3>

                                  {item.sku && (
                                    <p className="mt-1 text-sm text-[#4B5563]">
                                      SKU:{" "}
                                      {
                                        item.sku
                                      }
                                    </p>
                                  )}

                                  {item.size_id && (
                                    <p className="mt-1 text-xs text-gray-400">
                                      Size ID:{" "}
                                      {
                                        item.size_id
                                      }
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-5 text-center font-semibold text-[#183153]">
                              {quantity}
                            </td>

                            <td className="px-5 py-5 text-right text-[#183153]">
                              ৳{" "}
                              {unitPrice.toLocaleString()}
                            </td>

                            <td
                              className="px-5 py-5 text-right font-bold"
                              style={{
                                color:
                                  themeColor,
                              }}
                            >
                              ৳{" "}
                              {lineTotal.toLocaleString()}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-2xl border border-[#E7D8BC] bg-white p-6 shadow-md sm:p-7">
              <div className="flex items-center gap-3">
                <MapPin
                  size={24}
                  style={{
                    color: themeColor,
                  }}
                />

                <h2
                  className="text-2xl font-bold"
                  style={{
                    color: themeColor,
                  }}
                >
                  Shipping Address
                </h2>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-[#4B5563]">
                    Customer Name
                  </p>

                  <p className="mt-1 font-semibold text-[#183153]">
                    {order.customer_name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#4B5563]">
                    Phone
                  </p>

                  <p className="mt-1 font-semibold text-[#183153]">
                    {order.phone}
                  </p>
                </div>

                {order.email && (
                  <div>
                    <p className="text-sm text-[#4B5563]">
                      Email
                    </p>

                    <p className="mt-1 font-semibold text-[#183153]">
                      {order.email}
                    </p>
                  </div>
                )}

                <div className="sm:col-span-2">
                  <p className="text-sm text-[#4B5563]">
                    Delivery Address
                  </p>

                  <p className="mt-1 font-semibold leading-7 text-[#183153]">
                    {order.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="rounded-2xl border border-[#E7D8BC] bg-white p-6 shadow-md sm:p-7">
              <h2
                className="text-2xl font-bold"
                style={{
                  color: themeColor,
                }}
              >
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#4B5563]">
                    Order Date
                  </span>

                  <span className="font-semibold text-[#183153]">
                    {formatDate(
                      order.created_at
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#4B5563]">
                    Status
                  </span>

                  <span
                    className="rounded-full px-4 py-2 text-sm font-semibold"
                    style={{
                      backgroundColor:
                        `${themeColor}15`,
                      color: themeColor,
                    }}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#4B5563]">
                    Payment
                  </span>

                  <span className="text-right font-semibold text-[#183153]">
                    {order.payment_method ||
                      "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#4B5563]">
                    Payment Status
                  </span>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getPaymentStatusStyle(
                      order.payment_status
                    )}`}
                  >
                    {order.payment_status ||
                      "Pending"}
                  </span>
                </div>

                <hr className="border-[#E7D8BC]" />

                <div className="flex items-center justify-between">
                  <span className="text-[#4B5563]">
                    Subtotal
                  </span>

                  <span className="font-semibold text-[#183153]">
                    ৳{" "}
                    {Number(
                      order.subtotal || 0
                    ).toLocaleString()}
                  </span>
                </div>

                {Number(
                  order.discount || 0
                ) > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#4B5563]">
                      Discount
                    </span>

                    <span className="font-semibold text-green-600">
                      - ৳{" "}
                      {Number(
                        order.discount || 0
                      ).toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-[#4B5563]">
                    Shipping
                  </span>

                  <span className="font-semibold text-[#183153]">
                    ৳{" "}
                    {Number(
                      order.shipping ||
                        order.shipping_charge ||
                        0
                    ).toLocaleString()}
                  </span>
                </div>

                <hr className="border-[#E7D8BC]" />

                <div className="flex items-center justify-between">
                  <span
                    className="text-2xl font-bold"
                    style={{
                      color: themeColor,
                    }}
                  >
                    Total
                  </span>

                  <span
                    className="text-2xl font-bold"
                    style={{
                      color: themeColor,
                    }}
                  >
                    ৳{" "}
                    {Number(
                      order.total || 0
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            {latestPayment && (
              <div className="rounded-2xl border border-[#E7D8BC] bg-white p-6 shadow-md sm:p-7">
                <div className="flex items-center gap-3">
                  <CreditCard
                    size={23}
                    style={{
                      color: themeColor,
                    }}
                  />

                  <h2
                    className="text-xl font-bold"
                    style={{
                      color: themeColor,
                    }}
                  >
                    Payment Details
                  </h2>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-[#4B5563]">
                      Method
                    </span>

                    <span className="text-right text-sm font-semibold text-[#183153]">
                      {
                        latestPayment.payment_method
                      }
                    </span>
                  </div>

                  {latestPayment.transaction_id && (
                    <div className="flex justify-between gap-4">
                      <span className="text-sm text-[#4B5563]">
                        Transaction ID
                      </span>

                      <span className="break-all text-right text-sm font-semibold text-[#183153]">
                        {
                          latestPayment.transaction_id
                        }
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-[#4B5563]">
                      Amount
                    </span>

                    <span className="text-sm font-semibold text-[#183153]">
                      ৳{" "}
                      {Number(
                        latestPayment.amount ||
                          0
                      ).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-[#4B5563]">
                      Status
                    </span>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getPaymentStatusStyle(
                        latestPayment.status
                      )}`}
                    >
                      {latestPayment.status}
                    </span>
                  </div>

                  {latestPayment
                    .rejection_reason && (
                    <div className="rounded-xl bg-red-50 p-4">
                      <p className="text-xs font-semibold text-red-500">
                        Rejection Reason
                      </p>

                      <p className="mt-1 text-sm text-red-700">
                        {
                          latestPayment.rejection_reason
                        }
                      </p>
                    </div>
                  )}

                  {latestPayment.admin_note && (
                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-semibold text-gray-500">
                        Admin Note
                      </p>

                      <p className="mt-1 text-sm text-gray-700">
                        {
                          latestPayment.admin_note
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Delivery */}
            {(order.shipping_method ||
              order.estimated_delivery_date ||
              order.courier_name ||
              order.tracking_number) && (
              <div className="rounded-2xl border border-[#E7D8BC] bg-white p-6 shadow-md sm:p-7">
                <div className="flex items-center gap-3">
                  <Truck
                    size={23}
                    style={{
                      color: themeColor,
                    }}
                  />

                  <h2
                    className="text-xl font-bold"
                    style={{
                      color: themeColor,
                    }}
                  >
                    Delivery
                  </h2>
                </div>

                <div className="mt-5 space-y-4">
                  {order.shipping_method && (
                    <div className="flex justify-between gap-4">
                      <span className="text-sm text-[#4B5563]">
                        Method
                      </span>

                      <span className="text-sm font-semibold text-[#183153]">
                        {
                          order.shipping_method
                        }
                      </span>
                    </div>
                  )}

                  {order.estimated_delivery_date && (
                    <div className="flex justify-between gap-4">
                      <span className="text-sm text-[#4B5563]">
                        Estimated Delivery
                      </span>

                      <span className="text-right text-sm font-semibold text-[#183153]">
                        {formatDate(
                          order.estimated_delivery_date
                        )}
                      </span>
                    </div>
                  )}

                  {order.courier_name && (
                    <div className="flex justify-between gap-4">
                      <span className="text-sm text-[#4B5563]">
                        Courier
                      </span>

                      <span className="text-sm font-semibold text-[#183153]">
                        {order.courier_name}
                      </span>
                    </div>
                  )}

                  {order.tracking_number && (
                    <div className="flex justify-between gap-4">
                      <span className="text-sm text-[#4B5563]">
                        Tracking Number
                      </span>

                      <span className="break-all text-right text-sm font-semibold text-[#183153]">
                        {
                          order.tracking_number
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cancellation / Rejection */}
            {(order.cancellation_reason ||
              order.rejection_reason) && (
              <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-md">
                <h2 className="text-xl font-bold text-red-600">
                  {order.status ===
                  "Cancelled"
                    ? "Cancellation Reason"
                    : "Rejection Reason"}
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-700">
                  {order.cancellation_reason ||
                    order.rejection_reason}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}