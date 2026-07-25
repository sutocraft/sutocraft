"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setProducts(data || []);
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadProducts();
  }

  return (
    <div className="p-8">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Products
        </h1>

        <Link
          href="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Product
        </Link>
      </div>

      <table className="w-full border">

        <thead className="bg-gray-200">

          <tr>

            <th className="border p-3">Name</th>

            <th className="border p-3">Category</th>

            <th className="border p-3">Price</th>

            <th className="border p-3">Action</th>

          </tr>

        </thead>

        <tbody>

          {products.map((product) => (

            <tr key={product.id}>

              <td className="border p-3">
                {product.name}
              </td>

              <td className="border p-3">
                {product.categories?.name}
              </td>

              <td className="border p-3">
                ${product.price}
              </td>

              <td className="border p-3">

                <Link
                  href={`/admin/products/edit/${product.id}`}
                  className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteProduct(product.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}