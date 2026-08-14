"use client";

import Link from "next/link";
import { getOrders } from "@/lib/orders";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/app/components/website/settings.theme_color";

type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Rejected";

type Order = {
  id: string;
  order_number: string | null;
  created_at: string;
  total: number | null;
  status: OrderStatus;
  payment_status: string | null;
  payment_method: string | null;
};

function getStatusStyle(
  status: OrderStatus,
  themeColor: string
) {
  switch (status) {
    case "Pending":
      return {
        backgroundColor: "#FEF3C7",
        color: "#B45309",
      };

    case "Confirmed":
      return {
        backgroundColor: `${themeColor}18`,
        color: themeColor,
      };

    case "Processing":
      return {
        backgroundColor: "#E0E7FF",
        color: "#4338CA",
      };

    case "Shipped":
      return {
        backgroundColor: "#EDE9FE",
        color: "#7C3AED",
      };

    case "Delivered":
      return {
        backgroundColor: "#DCFCE7",
        color: "#15803D",
      };

    case "Cancelled":
      return {
        backgroundColor: "#FEE2E2",
        color: "#DC2626",
      };

    case "Rejected":
      return {
        backgroundColor: "#FFEDD5",
        color: "#C2410C",
      };

    default:
      return {
        backgroundColor: "#F3F4F6",
        color: "#4B5563",
      };
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function OrdersPage() {
  const { themeColor } = useTheme();

  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const data = await getOrders();

      setOrders(data as Order[]);
    } catch (err: any) {
      console.error("Failed to load orders:", err);

      setError(
        err?.message ||
          "Unable to load your orders."
      );
    } finally {
      setLoading(false);
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

      return (
        orderNumber
          .toLowerCase()
          .includes(keyword) ||
        order.status
          .toLowerCase()
          .includes(keyword) ||
        (order.payment_method || "")
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [orders, search]);

  return (
    <main className="min-h-screen bg-[#F8F4EC] py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1
              className="text-4xl font-bold sm:text-5xl"
              style={{ color: themeColor }}
            >
              My Orders
            </h1>

            <p className="mt-2 text-[#4B5563]">
              View your order history and current
              order status.
            </p>
          </div>

          <Link
            href="/account"
            className="rounded-xl border bg-white px-6 py-3 font-medium transition hover:text-white"
            style={{
              borderColor: `${themeColor}45`,
              color: themeColor,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                themeColor;
              e.currentTarget.style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "#FFFFFF";
              e.currentTarget.style.color =
                themeColor;
            }}
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6 rounded-2xl border border-[#E7D8BC] bg-white p-6 shadow-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <input
              type="text"
              placeholder="Search Order Number..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-xl border bg-white px-4 py-3 text-[#183153] outline-none transition md:w-80"
              style={{
                borderColor: `${themeColor}35`,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor =
                  themeColor;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor =
                  `${themeColor}35`;
              }}
            />

            <div className="text-[#4B5563]">
              Total Orders:
              <span
                className="ml-2 font-bold"
                style={{
                  color: themeColor,
                }}
              >
                {filteredOrders.length}
              </span>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border border-[#E7D8BC] bg-white p-20 text-center shadow-md">
            <div
              className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200"
              style={{
                borderTopColor: themeColor,
              }}
            />

            <p className="mt-4 text-[#4B5563]">
              Loading your orders...
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          /* Empty */
          <div className="rounded-2xl border border-[#E7D8BC] bg-white p-20 text-center shadow-md">
            <div className="mb-5 text-6xl">
              📦
            </div>

            <h2
              className="text-3xl font-bold"
              style={{
                color: themeColor,
              }}
            >
              {search
                ? "No Matching Orders"
                : "No Orders Yet"}
            </h2>

            <p className="mt-3 text-[#4B5563]">
              {search
                ? "Try searching with another order number."
                : "You haven't placed any order yet."}
            </p>

            {!search && (
              <Link
                href="/products"
                className="mt-8 inline-block rounded-xl px-8 py-3 font-semibold text-white transition hover:opacity-90"
                style={{
                  backgroundColor: themeColor,
                }}
              >
                Start Shopping
              </Link>
            )}
          </div>
        ) : (
          /* Orders Table */
          <div className="overflow-hidden rounded-2xl border border-[#E7D8BC] bg-white shadow-md">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead
                  style={{
                    backgroundColor: `${themeColor}08`,
                  }}
                >
                  <tr>
                    <th
                      className="px-7 py-5 text-left font-semibold"
                      style={{
                        color: themeColor,
                      }}
                    >
                      Order Number
                    </th>

                    <th
                      className="px-7 py-5 text-left font-semibold"
                      style={{
                        color: themeColor,
                      }}
                    >
                      Date
                    </th>

                    <th
                      className="px-7 py-5 text-left font-semibold"
                      style={{
                        color: themeColor,
                      }}
                    >
                      Total
                    </th>

                    <th
                      className="px-7 py-5 text-left font-semibold"
                      style={{
                        color: themeColor,
                      }}
                    >
                      Payment
                    </th>

                    <th
                      className="px-7 py-5 text-left font-semibold"
                      style={{
                        color: themeColor,
                      }}
                    >
                      Status
                    </th>

                    <th
                      className="px-7 py-5 text-left font-semibold"
                      style={{
                        color: themeColor,
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => {
                    const statusStyle =
                      getStatusStyle(
                        order.status,
                        themeColor
                      );

                    return (
                      <tr
                        key={order.id}
                        className="border-t border-[#E7D8BC] transition hover:bg-[#FCFAF6]"
                      >
                        <td className="px-7 py-6">
                          <span
                            className="font-bold"
                            style={{
                              color: themeColor,
                            }}
                          >
                            {order.order_number ||
                              order.id}
                          </span>
                        </td>

                        <td className="px-7 py-6 text-[#4B5563]">
                          {formatDate(
                            order.created_at
                          )}
                        </td>

                        <td className="px-7 py-6">
                          <span
                            className="font-semibold"
                            style={{
                              color: themeColor,
                            }}
                          >
                            ৳{" "}
                            {Number(
                              order.total || 0
                            ).toLocaleString()}
                          </span>
                        </td>

                        <td className="px-7 py-6 text-sm text-[#4B5563]">
                          <div className="font-medium text-[#183153]">
                            {order.payment_method ||
                              "N/A"}
                          </div>

                          <div className="mt-1 text-xs">
                            {order.payment_status ||
                              "Pending"}
                          </div>
                        </td>

                        <td className="px-7 py-6">
                          <span
                            className="inline-flex rounded-full px-4 py-2 text-sm font-semibold"
                            style={statusStyle}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td className="px-7 py-6">
                          <Link
                            href={`/account/orders/${order.id}`}
                            className="inline-flex items-center rounded-lg border px-5 py-2 font-semibold transition"
                            style={{
                              borderColor:
                                themeColor,
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
                                "transparent";
                              e.currentTarget.style.color =
                                themeColor;
                            }}
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}