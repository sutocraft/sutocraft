"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type OptionValue = {
  id: string;
  value: string;
};

type Props = {
  value: OptionValue;
  onDelete: () => void;
};

export default function VariantValueCard({
  value,
  onDelete,
}: Props) {
  const [editing, setEditing] =
    useState(false);

  const [name, setName] =
  useState(value.value);

  async function save() {

    if (!name.trim()) return;

    const { error } = await supabase
      .from("product_option_values")
      .update({
        value: name.trim(),
      })
      .eq("id", value.id);

    if (error) {
      alert(error.message);
      return;
    }

    setEditing(false);
  }

  return (
    <div className="flex items-center justify-between rounded border px-3 py-2">

      {editing ? (

        <div className="flex flex-1 gap-2">

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="flex-1 rounded border px-2 py-1"
          />

          <button
            type="button"
            onClick={save}
            className="rounded bg-green-600 px-3 py-1 text-white"
          >
            Save
          </button>

          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setName(value.value);
            }}
            className="rounded bg-gray-500 px-3 py-1 text-white"
          >
            Cancel
          </button>

        </div>

      ) : (

        <>
          <span>{value.value}</span>

          <div className="flex gap-2">

            <button
              type="button"
              onClick={() =>
                setEditing(true)
              }
              className="rounded bg-yellow-500 px-3 py-1 text-white"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={onDelete}
              className="rounded bg-red-600 px-3 py-1 text-white"
            >
              Delete
            </button>

          </div>
        </>

      )}

    </div>
  );
}