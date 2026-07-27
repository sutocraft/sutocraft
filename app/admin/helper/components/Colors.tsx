"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Color = {
  id: string;
  name: string;
  created_at: string;
};

export default function Colors() {
  const [colors, setColors] = useState<Color[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadColors();
  }, []);

  async function loadColors() {
    setLoading(true);

    const { data, error } = await supabase
      .from("colors")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error(error.message);
    }

    setColors(data || []);
    setLoading(false);
  }

  async function saveColor() {
    const colorName = name.trim();

    if (!colorName) return;

    setLoading(true);

    const color = colorName;

    let query = supabase
  .from("colors")
  .select("id")
  .eq("name", color);

if (editingId) {
  query = query.neq("id", editingId);
}

const { data: existingColor } = await query.maybeSingle();

    if (existingColor) {
      alert("Color already exists.");
      setLoading(false);
      return;
    }

    let error;

    if (editingId) {
  const result = await supabase
  .from("colors")
  .update({
  name: colorName,
})
  .eq("id", editingId);

error = result.error;
} else {
      ({ error } = await supabase
  .from("colors")
  .insert([
    {
      name: colorName,
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

await loadColors();

    setLoading(false);
  }

  function editColor(id: string, name: string) {
  console.log(id);
  setEditingId(id);
  setName(name);
}

  async function deleteColor(id: string) {
    const ok = window.confirm(
      "Are you sure you want to delete this color?"
    );

    if (!ok) return;

    setLoading(true);

    const { error } = await supabase
      .from("colors")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error.message);
    }

    await loadColors();

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
          placeholder="Color Name"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              saveColor();
            }
          }}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-zinc-200"
        />

        <button
          type="button"
          onClick={saveColor}
          disabled={!name.trim() || loading}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-700"
        >
          {loading
            ? "Saving..."
            : editingId
            ? "Update Color"
            : "Add Color"}
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
            {loading && colors.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-8 text-center text-zinc-400"
                >
                  Loading...
                </td>
              </tr>
            ) : colors.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-8 text-center text-zinc-500"
                >
                  No colors found.
                </td>
              </tr>
            ) : (
              colors.map((color) => (

                            <tr
                  key={color.id}
                  className="border-t border-zinc-800 transition hover:bg-zinc-900/50"
                >
                  <td className="px-4 py-3 text-sm text-zinc-200">
                    {color.name}
                  </td>

                  

                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => editColor(color.id, color.name)}
                      disabled={loading}
                      className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-700"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteColor(color.id)}
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
