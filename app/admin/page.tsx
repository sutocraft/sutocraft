"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  sku: string;
  image_url: string;
  created_at: string;
};

export default function AdminPage() {
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [inventoryValue, setInventoryValue] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { count: products } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    const { count: categories } = await supabase
      .from("categories")
      .select("*", { count: "exact", head: true });

    const { data } = await supabase
      .from("products")
      .select("price,stock");

    const { data: recent } = await supabase
      .from("products")
      .select("id,name,sku,image_url,created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    let total = 0;
    let low = 0;

    data?.forEach((item) => {
      total += Number(item.price) * Number(item.stock);

      if (Number(item.stock) <= 10) {
        low++;
      }
    });

    setInventoryValue(total);
    setLowStock(low);
    setProductCount(products || 0);
    setCategoryCount(categories || 0);
    setRecentProducts(recent || []);
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="rounded-xl bg-blue-600 p-5 shadow">
          <p className="text-sm text-blue-100">Total Products</p>
          <h2 className="text-4xl font-bold text-white mt-2">
            {productCount}
          </h2>
        </div>

        <div className="rounded-xl bg-green-600 p-5 shadow">
          <p className="text-sm text-green-100">Total Categories</p>
          <h2 className="text-4xl font-bold text-white mt-2">
            {categoryCount}
          </h2>
        </div>

        <div className="rounded-xl bg-purple-600 p-5 shadow">
          <p className="text-sm text-purple-100">Inventory Value</p>
          <h2 className="text-4xl font-bold text-white mt-2">
            ৳ {inventoryValue.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-xl bg-red-600 p-5 shadow">
          <p className="text-sm text-red-100">Low Stock Products</p>
          <h2 className="text-4xl font-bold text-white mt-2">
            {lowStock}
          </h2>
        </div>

      </div>

      <div className="mt-10 rounded-xl border border-gray-700 overflow-hidden">

        <div className="flex justify-between items-center p-4 border-b border-gray-700">

          <h2 className="text-xl font-semibold">
            Recent Products
          </h2>

          <Link
            href="/admin/products"
            className="text-blue-400 hover:underline"
          >
            View All
          </Link>

        </div>

        <table className="w-full">

          <thead className="bg-gray-900">

            <tr>

              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">SKU</th>
              <th className="p-3 text-left">Created</th>

            </tr>

          </thead>

          <tbody>

            {recentProducts.map((product) => (

              <tr
                key={product.id}
                className="border-t border-gray-700 hover:bg-gray-900"
              >

                <td className="p-3">

                  {product.image_url ? (

                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 rounded object-cover"
                    />

                  ) : (

                    <div className="w-12 h-12 rounded bg-gray-700"></div>

                  )}

                </td>

                <td className="p-3">
                  {product.name}
                </td>

                <td className="p-3">
                  {product.sku}
                </td>

                <td className="p-3">
                  {new Date(product.created_at).toLocaleDateString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}