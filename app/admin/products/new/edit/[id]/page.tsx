"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Category = {
  id: string;
  name: string;
};

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);

  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    loadCategories();
    loadProduct();
  }, []);

  async function loadCategories() {
    const { data } = await supabase
      .from("categories")
      .select("id,name")
      .order("name");

    if (data) setCategories(data);
  }

  async function loadProduct() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setCategoryId(data.category_id);
    setName(data.name);
    setSlug(data.slug);
    setDescription(data.description || "");
    setPrice(String(data.price));
  }

  async function updateProduct() {
    const { error } = await supabase
      .from("products")
      .update({
        category_id: categoryId,
        name,
        slug,
        description,
        price: Number(price),
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Product Updated");

    router.push("/admin/products");
  }

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Edit Product
      </h1>

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        <option value="">Select Category</option>

        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}

      </select>

      <br /><br />

      <input
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <br /><br />

      <button onClick={updateProduct}>
        Update Product
      </button>

    </div>
  );
}