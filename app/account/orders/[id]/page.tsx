"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function OrderDetailsPage() {
  const { id } = useParams();

  const order = {
    id,

    date: "04 Aug 2026",

    status: "Pending",

    payment: "Cash On Delivery",

    subtotal: 3000,

    shipping: 250,

    total: 3250,

    customer: {
      name: "Md. Mostafa",
      phone: "01406503242",
      email: "shafaabidautomation.bd@gmail.com",
      address:
        "KSRM, Royel Gate, Bara Kumira-4314, Sitakunda, Chattogram",
    },

    items: [
      {
        id: 1,
        image:
          "https://placehold.co/80x100",

        name: "Premium Three Piece Bold",

        sku: "PTP-001",

        qty: 2,

        price: 1500,
      },

      {
        id: 2,

        image:
          "https://placehold.co/80x100",

        name: "Premium Punjabi",

        sku: "PNJ-008",

        qty: 1,

        price: 250,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#F8F4EC] py-10">

      <div className="max-w-7xl mx-auto px-4">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div>

            <h1 className="text-5xl font-bold text-[#183153]">
              Order Details
            </h1>

            <p className="mt-2 text-[#4B5563]">
              Order #{order.id}
            </p>

          </div>

          <Link
            href="/account/orders"
            className="px-6 py-3 rounded-xl border border-[#E7D8BC] bg-white text-[#183153] hover:bg-[#A8741A] hover:text-white transition"
          >
            ← Back to Orders
          </Link>

        </div>

        <div className="grid lg:grid-cols-3 gap-7">

          <div className="lg:col-span-2 space-y-7">

                        <div className="bg-white border border-[#E7D8BC] rounded-2xl shadow-md p-7">

              <h2 className="text-3xl font-bold text-[#183153] mb-6">
                Ordered Products
              </h2>

              <div className="overflow-x-auto">

                <table className="min-w-full">

                  <thead className="bg-[#F8F4EC]">

                    <tr>

                      <th className="text-left px-5 py-4 text-[#183153]">
                        Product
                      </th>

                      <th className="text-center px-5 py-4 text-[#183153]">
                        Qty
                      </th>

                      <th className="text-right px-5 py-4 text-[#183153]">
                        Price
                      </th>

                      <th className="text-right px-5 py-4 text-[#183153]">
                        Total
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {order.items.map((item) => (

                      <tr
                        key={item.id}
                        className="border-t border-[#E7D8BC]"
                      >

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-4">

                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-24 rounded-lg border border-[#E7D8BC] object-cover"
                            />

                            <div>

                              <h3 className="font-bold text-[#183153]">
                                {item.name}
                              </h3>

                              <p className="mt-1 text-[#4B5563] text-sm">
                                SKU : {item.sku}
                              </p>

                            </div>

                          </div>

                        </td>

                        <td className="text-center px-5 py-5 text-[#183153] font-semibold">
                          {item.qty}
                        </td>

                        <td className="text-right px-5 py-5 text-[#183153]">
                          ৳ {item.price.toLocaleString()}
                        </td>

                        <td className="text-right px-5 py-5 font-bold text-[#183153]">
                          ৳ {(item.qty * item.price).toLocaleString()}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

            <div className="bg-white border border-[#E7D8BC] rounded-2xl shadow-md p-7">

              <h2 className="text-3xl font-bold text-[#183153] mb-6">
                Shipping Address
              </h2>

              <div className="space-y-4">

                <div>

                  <p className="text-sm text-[#4B5563]">
                    Customer Name
                  </p>

                  <p className="font-semibold text-[#183153]">
                    {order.customer.name}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-[#4B5563]">
                    Email
                  </p>

                  <p className="font-semibold text-[#183153]">
                    {order.customer.email}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-[#4B5563]">
                    Phone
                  </p>

                  <p className="font-semibold text-[#183153]">
                    {order.customer.phone}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-[#4B5563]">
                    Delivery Address
                  </p>

                  <p className="font-semibold text-[#183153] leading-7">
                    {order.customer.address}
                  </p>

                </div>

              </div>

            </div>

          </div>

          <div className="space-y-6">

                       <div className="bg-white border border-[#E7D8BC] rounded-2xl shadow-md p-7">

              <h2 className="text-3xl font-bold text-[#183153] mb-6">
                Order Summary
              </h2>

              <div className="space-y-5">

                <div className="flex items-center justify-between">

                  <span className="text-[#4B5563]">
                    Order Date
                  </span>

                  <span className="font-semibold text-[#183153]">
                    {order.date}
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-[#4B5563]">
                    Status
                  </span>

                  <span className="inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
                    {order.status}
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-[#4B5563]">
                    Payment
                  </span>

                  <span className="font-semibold text-[#183153]">
                    {order.payment}
                  </span>

                </div>

                <hr className="border-[#E7D8BC]" />

                <div className="flex items-center justify-between">

                  <span className="text-[#4B5563]">
                    Subtotal
                  </span>

                  <span className="font-semibold text-[#183153]">
                    ৳ {order.subtotal.toLocaleString()}
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-[#4B5563]">
                    Shipping
                  </span>

                  <span className="font-semibold text-[#183153]">
                    ৳ {order.shipping.toLocaleString()}
                  </span>

                </div>

                <hr className="border-[#E7D8BC]" />

                <div className="flex items-center justify-between">

                  <span className="text-2xl font-bold text-[#183153]">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-[#183153]">
                    ৳ {order.total.toLocaleString()}
                  </span>

                </div>

              </div>

            </div>

            <button
              className="w-full rounded-xl bg-[#A8741A] py-4 text-lg font-semibold text-white transition hover:opacity-90"
            >
              Download Invoice
            </button>

          </div>

        </div>

      </div>

    </main>
  );
} 