"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Order = {
  id: string;
  date: string;
  total: number;
  status:
    | "Pending"
    | "Confirmed"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Cancelled";
};

const orders: Order[] = [
  {
    id: "#SC100001",
    date: "04 Aug 2026",
    total: 3250,
    status: "Pending",
  },
  {
    id: "#SC100002",
    date: "28 Jul 2026",
    total: 1850,
    status: "Delivered",
  },
  {
    id: "#SC100003",
    date: "20 Jul 2026",
    total: 5700,
    status: "Processing",
  },
];

function badge(status: Order["status"]) {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-700";

    case "Confirmed":
      return "bg-blue-100 text-blue-700";

    case "Processing":
      return "bg-indigo-100 text-indigo-700";

    case "Shipped":
      return "bg-purple-100 text-purple-700";

    case "Delivered":
      return "bg-green-100 text-green-700";

    case "Cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function OrdersPage() {
  const [search, setSearch] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) =>
      order.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <main className="min-h-screen bg-[#F8F4EC] py-10">

      <div className="max-w-7xl mx-auto px-4">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div>

            <h1 className="text-5xl font-bold text-[#183153]">
              My Orders
            </h1>

            <p className="mt-2 text-[#4B5563]">
              View your order history and current order status.
            </p>

          </div>

          <Link
            href="/account"
            className="px-6 py-3 rounded-xl border border-[#E7D8BC] bg-white text-[#183153] hover:bg-[#A8741A] hover:text-white transition"
          >
            ← Back to Dashboard
          </Link>

        </div>

        <div className="bg-white border border-[#E7D8BC] rounded-2xl shadow-md p-6 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <input
              type="text"
              placeholder="Search Order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-80 rounded-xl border border-[#E7D8BC] bg-white px-4 py-3 text-[#183153] outline-none focus:border-[#A8741A]"
            />

            <div className="text-[#4B5563]">
              Total Orders :
              <span className="ml-2 font-bold text-[#183153]">
                {filteredOrders.length}
              </span>
            </div>

          </div>

        </div>

        {filteredOrders.length === 0 ? (

          <div className="bg-white border border-[#E7D8BC] rounded-2xl shadow-md p-20 text-center">

            <div className="text-6xl mb-5">
              📦
            </div>

            <h2 className="text-3xl font-bold text-[#183153]">
              No Orders Yet
            </h2>

            <p className="mt-3 text-[#4B5563]">
              You haven't placed any order yet.
            </p>

            <Link
              href="/products"
              className="inline-block mt-8 bg-[#A8741A] text-white px-8 py-3 rounded-xl hover:opacity-90 transition"
            >
              Start Shopping
            </Link>

          </div>

        ) : (

          <div className="bg-white border border-[#E7D8BC] rounded-2xl shadow-md overflow-hidden">

            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead className="bg-[#F8F4EC]">

                  <tr>

                    <th className="text-left px-7 py-5 text-[#183153] font-semibold">
                      Order ID
                    </th>

                    <th className="text-left px-7 py-5 text-[#183153] font-semibold">
                      Date
                    </th>

                    <th className="text-left px-7 py-5 text-[#183153] font-semibold">
                      Total
                    </th>

                    <th className="text-left px-7 py-5 text-[#183153] font-semibold">
                      Status
                    </th>

                    <th className="text-left px-7 py-5 text-[#183153] font-semibold">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>
                  {filteredOrders.map((order) => (

                    <tr
                      key={order.id}
                      className="border-t border-[#E7D8BC] hover:bg-[#FCFAF6] transition"
                    >

                      <td className="px-7 py-6">

                        <span className="font-bold text-[#183153]">
                          {order.id}
                        </span>

                      </td>

                      <td className="px-7 py-6 text-[#4B5563]">
                        {order.date}
                      </td>

                      <td className="px-7 py-6">

                        <span className="font-semibold text-[#183153]">
                          ৳ {order.total.toLocaleString()}
                        </span>

                      </td>

                      <td className="px-7 py-6">

                        <span
                          className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${badge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>

                      </td>

                      <td className="px-7 py-6">

                        <Link
                          href={`/account/orders/${order.id.replace(
                            "#",
                            ""
                          )}`}
                          className="inline-flex items-center rounded-lg border border-[#A8741A] px-5 py-2 font-semibold text-[#A8741A] transition hover:bg-[#A8741A] hover:text-white"
                        >
                          View Details
                        </Link>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        )}

        <div className="mt-8 flex items-center justify-between">

          <button
            className="rounded-xl border border-[#E7D8BC] bg-white px-6 py-3 text-[#183153] hover:bg-[#F8F4EC]"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-2">

            <button className="h-11 w-11 rounded-xl bg-[#A8741A] text-white font-bold">
              1
            </button>

            <button className="h-11 w-11 rounded-xl border border-[#E7D8BC] bg-white text-[#183153] hover:bg-[#F8F4EC]">
              2
            </button>

            <button className="h-11 w-11 rounded-xl border border-[#E7D8BC] bg-white text-[#183153] hover:bg-[#F8F4EC]">
              3
            </button>

          </div>

          <button
            className="rounded-xl border border-[#E7D8BC] bg-white px-6 py-3 text-[#183153] hover:bg-[#F8F4EC]"
          >
            Next →
          </button>

        </div>
              </div>

    </main>
  );
}
