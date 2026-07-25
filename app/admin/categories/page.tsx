"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });

    setCategories(data || []);
  }

  async function saveCategory() {
    if (!name) return;

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const { error } = await supabase.from("categories").insert([
      {
        name,
        slug,
      },
    ]);

    if (!error) {
      setName("");
      loadCategories();
    } else {
      alert(error.message);
    }
  }

  return (
    <div>
      <h1>Categories</h1>

      <br />

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category Name"
      />

      <button onClick={saveCategory}>
        Add Category
      </button>

      <br />
      <br />

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.name}</td>
              <td>{cat.slug}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}