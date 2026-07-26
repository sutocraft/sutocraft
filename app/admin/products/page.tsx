"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  sale_price: number;
  stock: number;
  image_url: string;
  featured: boolean;
  active: boolean;

  categories: {
    name: string;
  } | null;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
const [search, setSearch] = useState("");

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

    setProducts((data as Product[]) || []);
  }

  async function deleteProduct(id: string) {
    const ok = confirm("Are you sure you want to delete this product?");

    if (!ok) return;

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">

  <div>

    <h1 className="text-3xl font-bold">
      Products
    </h1>

    <p className="text-gray-500">
      Total Products : {products.length}
    </p>

  </div>

  <div className="flex items-center gap-3">

    <input
      type="text"
      placeholder="Search product..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-64 rounded-lg border border-gray-500 bg-gray-900 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
    />

    <Link href="/admin/products/new">
      <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg">
        + Add Product
      </button>
    </Link>

  </div>

</div>

      <div className="overflow-x-auto rounded-lg border shadow">

<table className="w-full border-collapse">

  <thead>
    <tr className="bg-gray-900">

      <th className="border p-2">Image</th>

      <th className="border p-2">
        Name
      </th>

      <th className="border p-2">
        SKU
      </th>

      <th className="border p-2">
        Category
      </th>

      <th className="border p-2">
        Price
      </th>

      <th className="border p-2">
        Sale
      </th>

      <th className="border p-2">
        Stock
      </th>

      <th className="border p-2">
        Status
      </th>

      <th className="border p-2">
        Featured
      </th>

      <th className="border p-2">
        Action
      </th>

    </tr>
  </thead>

  <tbody>

{products
  .filter(
    (product) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      product.sku
        .toLowerCase()
        .includes(search.toLowerCase())
  )
  .length === 0 ? (

    <tr>

      <td colSpan={10} className="text-center p-8 text-gray-500">

        No Products Found

      </td>

    </tr>

  ) : (

    products
      .filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          product.sku
            .toLowerCase()
            .includes(search.toLowerCase())
      )
      .map((product) => (
    <tr key={product.id} className="border">

      <td className="border p-2">

        {product.image_url ? (

          <img
            src={product.image_url}
            alt={product.name}
            className="w-16 h-16 rounded object-cover"
          />

        ) : (

          <div className="w-16 h-16 rounded bg-gray-800 flex items-center justify-center">
            No Image
          </div>

        )}

      </td>

      <td className="border p-2">
        {product.name}
      </td>

      <td className="border p-2">
        {product.sku}
      </td>

      <td className="border p-2">
        {product.categories?.name}
      </td>

      <td className="border p-2">
        ৳ {product.price}
      </td>

      <td className="border p-2 text-green-400">
        ৳ {product.sale_price}
      </td>

      <td className="border p-2">

        {product.stock > 10 ? (

          <span className="text-green-400">
            {product.stock}
          </span>

        ) : (

          <span className="text-red-400">
            {product.stock}
          </span>

        )}

      </td>

      <td className="border p-2">

        {product.active ? (

          <span className="text-green-400">
            Active
          </span>

        ) : (

          <span className="text-red-400">
            Inactive
          </span>

        )}

      </td>

      <td className="border p-2">

        {product.featured ? (
          "⭐"
        ) : (
          "-"
        )}

      </td>

      <td className="border p-2">

        <Link href={`/admin/products/edit/${product.id}`}>
          <button className="bg-blue-600 px-3 py-1 rounded">
            Edit
          </button>
        </Link>

        <button
          onClick={() => deleteProduct(product.id)}
          className="bg-red-600 px-3 py-1 rounded ml-2"
        >
          Delete
        </button>

      </td>

    </tr>
      ))

)}

</tbody>
      </table>

</div>
    </div>
  );
}