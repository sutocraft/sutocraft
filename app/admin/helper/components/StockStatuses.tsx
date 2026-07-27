"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type StockStatuses = {
  id: string;
  name: string;
  created_at: string;
};

export default function StockStatuses() {
  const [stockStatuses, setStockStatuses] = useState<StockStatuses[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStockStatuses();
  }, []);

  async function loadStockStatuses() {
    setLoading(true);

    const { data, error } = await supabase
      .from("stock_statuses")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error(error.message);
    }

    setStockStatuses(data || []);
    setLoading(false);
  }

  async function saveStockStatus() {
    const stockStatusName = name.trim();

    if (!stockStatusName) return;

    setLoading(true);

    const stockStatus = stockStatusName;

    let query = supabase
  .from("stock_statuses")
  .select("id")
  .eq("name", stockStatus);

if (editingId) {
  query = query.neq("id", editingId);
}

const { data: existingStockStatus } = await query.maybeSingle();

    if (existingStockStatus) {
      alert("Stock status already exists.");
      setLoading(false);
      return;
    }

    let error;

    if (editingId) {
  const result = await supabase
  .from("stock_statuses")
  .update({
  name: stockStatusName,
})
  .eq("id", editingId);

error = result.error;
} else {
      ({ error } = await supabase
  .from("stock_statuses")
  .insert([
    {
      name: stockStatusName,
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

await loadStockStatuses();

    setLoading(false);
  }

  function editStockStatus(id: string, name: string) {
  console.log(id);
  setEditingId(id);
  setName(name);
}

  async function deleteStockStatus(id: string) {
    const ok = window.confirm(
      "Are you sure you want to delete this stock status?"
    );

    if (!ok) return;

    setLoading(true);

    const { error } = await supabase
      .from("stock_statuses")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error.message);
    }

    await loadStockStatuses();

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
          placeholder="Stock Status Name"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              saveStockStatus();
            }
          }}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-zinc-200"
        />

        <button
          type="button"
          onClick={saveStockStatus}
          disabled={!name.trim() || loading}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-700"
        >
          {loading
            ? "Saving..."
            : editingId
            ? "Update Stock Status"
            : "Add Stock Status"}
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
            {loading && stockStatuses.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-8 text-center text-zinc-400"
                >
                  Loading...
                </td>
              </tr>
            ) : stockStatuses.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-8 text-center text-zinc-500"
                >
                  No stock statuses found.
                </td>
              </tr>
            ) : (
              stockStatuses.map((stockStatus) => (

                            <tr
                  key={stockStatus.id}
                  className="border-t border-zinc-800 transition hover:bg-zinc-900/50"
                >
                  <td className="px-4 py-3 text-sm text-zinc-200">
                    {stockStatus.name}
                  </td>

                  

                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => editStockStatus(stockStatus.id, stockStatus.name)}
                      disabled={loading}
                      className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-700"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteStockStatus(stockStatus.id)}
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
