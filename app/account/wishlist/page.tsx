"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getWishlist, removeFromWishlist } from "@/lib/wishlist";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadWishlist();
}, []);

async function loadWishlist() {
  const data = await getWishlist();

console.log(data);

  setWishlist(data);
  setLoading(false);
}

async function handleRemove(id: string) {
  await removeFromWishlist(id);

  console.log(wishlist);

  setWishlist((prev) => prev.filter((item) => item.id !== id));
}

  return (
    <main className="min-h-screen bg-[#F8F4EC] py-10">

      <div className="max-w-7xl mx-auto px-4">

        <div className="flex items-center justify-between mb-8">

          <div>

            <h1 className="text-5xl font-bold text-[#183153]">
              My Wishlist
            </h1>

            <p className="mt-2 text-[#4B5563]">
              Products you have saved for later.
            </p>

          </div>

          <Link
            href="/account"
            className="px-6 py-3 rounded-xl border border-[#E7D8BC] bg-white text-[#183153] hover:bg-[#A8741A] hover:text-white transition"
          >
            ← Back to Dashboard
          </Link>

        </div>

                <div className="bg-white border border-[#E7D8BC] rounded-2xl shadow-md overflow-hidden">

          <table className="w-full">

            <thead className="bg-[#F8F4EC] border-b border-[#E7D8BC]">

              <tr>

                <th className="text-left px-6 py-5 text-[#183153]">
                  Product
                </th>

                <th className="text-center px-6 py-5 text-[#183153]">
                  Price
                </th>

                <th className="text-center px-6 py-5 text-[#183153]">
                  Availability
                </th>

                <th className="text-right px-6 py-5 text-[#183153]">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {wishlist.map((item) => (
  <tr
    key={item.id}
    className="border-b last:border-b-0 border-[#E7D8BC]"
  >
    <td className="px-6 py-6">
      <div className="flex items-center gap-5">

        <img
          src={
            item.products?.image_url ||
            item.products?.thumbnail ||
            "https://placehold.co/120x140"
          }
          alt={item.products?.name ?? "Product"}
          className="w-24 h-28 object-cover rounded-xl border border-[#E7D8BC]"
        />

        <div>
          <h3 className="font-bold text-xl text-[#183153]">
            {item.products?.name}
          </h3>

          <p className="text-[#4B5563] mt-1">
            SKU : {item.products?.sku}
          </p>
        </div>

      </div>
    </td>

    <td className="text-center font-bold text-xl text-[#183153]">
      ৳ {Number(item.products?.sale_price ?? item.products?.price ?? 0).toLocaleString()}
    </td>

    <td className="text-center">
      <span className="inline-flex px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
        In Stock
      </span>
    </td>

    <td className="px-6">
      <div className="flex justify-end gap-3">

        <button className="px-5 py-3 rounded-xl bg-[#A8741A] text-white font-semibold hover:opacity-90 transition">
          Add to Cart
        </button>

        <button
  onClick={() => handleRemove(item.product_id)}
  className="px-5 py-3 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 transition"
>
  Remove
</button>

      </div>
    </td>
  </tr>
))}

            </tbody>

          </table>

        </div>

                <div className="flex items-center justify-between mt-8">

          <button
            className="rounded-xl border border-[#E7D8BC] bg-white px-6 py-3 text-[#183153] hover:bg-[#F8F4EC]"
          >
            ← Previous
          </button>

          <div className="flex gap-3">

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

        {wishlist.length === 0 && (

          <div className="bg-white border border-[#E7D8BC] rounded-2xl shadow-md py-20 text-center mt-8">

            <h2 className="text-3xl font-bold text-[#183153]">
              Your Wishlist is Empty
            </h2>

            <p className="mt-3 text-[#4B5563]">
              Browse products and add your favorite items.
            </p>

            <Link
              href="/products"
              className="inline-block mt-8 px-8 py-3 rounded-xl bg-[#A8741A] text-white font-semibold hover:opacity-90 transition"
            >
              Browse Products
            </Link>

          </div>

        )}

      </div>

    </main>
  );
}