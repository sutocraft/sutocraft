"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Category = {
  id: string;
  name: string;
};

export default function NewProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("id,name")
      .order("name");

    if (!error && data) {
      setCategories(data);
    }
  }

  async function addProduct() {
    if (!categoryId || !name || !slug) {
      alert("Please fill all required fields.");
      return;
    }

    const { error } = await supabase.from("products").insert({
      category_id: categoryId,
      name,
      slug,
      description,
      price: Number(price),
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Product Added");

    setCategoryId("");
    setName("");
    setSlug("");
    setDescription("");
    setPrice("");
  }

  return (
    <div>
      <h1>Add Product</h1>

      <br />

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

      <br />
      <br />

      <input
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />
      <br />

      <input
        placeholder="Slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />

      <br />
      <br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />
      <br />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <br />
      <br />

      <button onClick={addProduct}>Save Product</button>
    </div>
  );
}