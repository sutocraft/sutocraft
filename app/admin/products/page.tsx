"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  price: number;
  categories: {
    name: string;
  } | null;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Products</h1>

        <Link href="/admin/products/new">
          <button>Add Product</button>
        </Link>
      </div>

      <table border={1} cellPadding={10} cellSpacing={0}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>

              <td>{product.categories?.name}</td>

              <td>{product.price}</td>

              <td>
                <Link href={`/admin/products/edit/${product.id}`}>
                  <button>Edit</button>
                </Link>

                {"  "}

                <button
                  onClick={() => deleteProduct(product.id)}
                  style={{ marginLeft: "10px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {products.length === 0 && (
            <tr>
              <td colSpan={4} align="center">
                No Products Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}