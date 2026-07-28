"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error(error.message);
    }

    setCategories(data || []);
    setLoading(false);
  }

  async function saveCategory() {
    const categoryName = name.trim();

    if (!categoryName) return;

    setLoading(true);

    const slug = categoryName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    let query = supabase
  .from("categories")
  .select("id")
  .eq("slug", slug);

if (editingId) {
  query = query.neq("id", editingId);
}

const { data: existingCategory } = await query.maybeSingle();

    if (existingCategory) {
      alert("Category already exists.");
      setLoading(false);
      return;
    }

    let error;

    if (editingId) {
  console.log("Editing ID:", editingId);
  console.log("Updating...");

  const result = await supabase
  .from("categories")
  .update({
    name: categoryName,
    slug,
  })
  .eq("id", editingId)
  .select()
  .single();

console.log("Update Result:", result);

console.log("Editing ID:", editingId);

const check = await supabase
  .from("categories")
  .select("*")
  .eq("id", editingId);

console.log("Check Row:", check);

console.log("Update Result:", result);
console.log("New Name:", categoryName);
console.log("Editing ID:", editingId);
console.log("Rows:", result.data);

error = result.error;
} else {
      ({ error } = await supabase
        .from("categories")
        .insert([
          {
            name: categoryName,
            slug,
          },
        ]));
    }

    if (error) {
      console.error(error.message);
      setLoading(false);
      return;
    }

    const checkAfterUpdate = await supabase
  .from("categories")
  .select("id,name,slug")
  .eq("id", editingId)
  .single();

console.log("After Update:", checkAfterUpdate.data);

setName("");
setEditingId(null);

await loadCategories();

console.log("Categories Reloaded");

    setLoading(false);
  }

  function editCategory(id: string, name: string) {
  console.log(id);
  setEditingId(id);
  setName(name);
}

  async function deleteCategory(id: string) {
    const ok = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!ok) return;

    setLoading(true);

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error.message);
    }

    await loadCategories();

    setLoading(false);
  }

  return (
    <div>
      <div className="mb-6 flex gap-3">
        <input
          type="text"
          autoFocus
          maxLength={50}
          value={name}
          disabled={loading}
          placeholder="Category Name"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              saveCategory();
            }
          }}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-zinc-200"
        />

        <button
          type="button"
          onClick={saveCategory}
          disabled={!name.trim() || loading}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-700"
        >
          {loading
            ? "Saving..."
            : editingId
            ? "Update Category"
            : "Add Category"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setName("");
            }}
            disabled={loading}
            className="rounded-lg border border-zinc-600 px-5 py-2 text-sm text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="min-w-full">
          <thead className="bg-zinc-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                Name
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                Slug
              </th>

              <th className="px-4 py-3 text-center text-sm font-semibold text-white">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && categories.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-8 text-center text-zinc-400"
                >
                  Loading...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-8 text-center text-zinc-500"
                >
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (

                            <tr
                  key={cat.id}
                  className="border-t border-zinc-800 transition hover:bg-zinc-900/50"
                >
                  <td className="px-4 py-3 text-sm text-zinc-200">
                    {cat.name}
                  </td>

                  <td className="px-4 py-3 text-sm text-zinc-400">
                    {cat.slug}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => editCategory(cat.id, cat.name)}
                      disabled={loading}
                      className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-700"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteCategory(cat.id)}
                      disabled={loading}
                      className="ml-2 rounded bg-red-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-zinc-700"
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
