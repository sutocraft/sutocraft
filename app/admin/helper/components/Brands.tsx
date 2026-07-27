"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Brand = {
  id: string;
  name: string;
  created_at: string;
};

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBrands();
  }, []);

  async function loadBrands() {
    setLoading(true);

    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error(error.message);
    }

    setBrands(data || []);
    setLoading(false);
  }

  async function saveBrand() {
    const brandName = name.trim();

    if (!brandName) return;

    setLoading(true);

    const brand = brandName;

    let query = supabase
  .from("brands")
  .select("id")
  .eq("name", brand);

if (editingId) {
  query = query.neq("id", editingId);
}

const { data: existingBrand } = await query.maybeSingle();

    if (existingBrand) {
      alert("Brand already exists.");
      setLoading(false);
      return;
    }

    let error;

    if (editingId) {
  const result = await supabase
  .from("brands")
  .update({
  name: brandName,
})
  .eq("id", editingId);

error = result.error;
} else {
      ({ error } = await supabase
  .from("brands")
  .insert([
    {
      name: brandName,
    },
  ]));
    }

    if (error) {
      console.error(error.message);
      setLoading(false);
      return;
    }

    setName("");
setEditingId(null);

await loadBrands();

    setLoading(false);
  }

  function editBrand(id: string, name: string) {
  console.log(id);
  setEditingId(id);
  setName(name);
}

  async function deleteBrand(id: string) {
    const ok = window.confirm(
      "Are you sure you want to delete this brand?"
    );

    if (!ok) return;

    setLoading(true);

    const { error } = await supabase
      .from("brands")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error.message);
    }

    await loadBrands();

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
          placeholder="Brand Name"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              saveBrand();
            }
          }}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-zinc-200"
        />

        <button
          type="button"
          onClick={saveBrand}
          disabled={!name.trim() || loading}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-700"
        >
          {loading
            ? "Saving..."
            : editingId
            ? "Update Brand"
            : "Add Brand"}
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

              

              <th className="px-4 py-3 text-center text-sm font-semibold text-white">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && brands.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-8 text-center text-zinc-400"
                >
                  Loading...
                </td>
              </tr>
            ) : brands.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-8 text-center text-zinc-500"
                >
                  No brands found.
                </td>
              </tr>
            ) : (
              brands.map((brand) => (

                            <tr
                  key={brand.id}
                  className="border-t border-zinc-800 transition hover:bg-zinc-900/50"
                >
                  <td className="px-4 py-3 text-sm text-zinc-200">
                    {brand.name}
                  </td>

                  

                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => editBrand(brand.id, brand.name)}
                      disabled={loading}
                      className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-700"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteBrand(brand.id)}
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
