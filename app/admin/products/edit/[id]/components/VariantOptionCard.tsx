"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import VariantValueCard from "./VariantValueCard";

type Option = {
  id: string;
  option_name: string;
};

type OptionValue = {
  id: string;
  value: string;
};

type Props = {
  option: Option;
  onDelete: () => void;
  onUpdate: (name: string) => void;
};

export default function VariantOptionCard({
  option,
  onDelete,
  onUpdate,
}: Props) {
  const [editing, setEditing] =
    useState(false);

  const [name, setName] =
    useState(option.option_name);

  const [values, setValues] =
    useState<OptionValue[]>([]);

  const [showAddValue, setShowAddValue] =
    useState(false);

  const [valueName, setValueName] =
    useState("");

  useEffect(() => {
    loadValues();
  }, []);

  async function loadValues() {
    const { data } = await supabase
      .from("product_option_values")
      .select("*")
      .eq("option_id", option.id)
      .order("created_at");

    setValues(data || []);
  }

  async function saveValue() {

    if (!valueName.trim()) return;

    const { error } = await supabase
      .from("product_option_values")
      .insert({
        option_id: option.id,
        value: valueName.trim(),
      });

    if (error) {
      alert(error.message);
      return;
    }

    setValueName("");
    setShowAddValue(false);

    loadValues();
  }

  async function deleteValue(id: string) {

    if (!confirm("Delete value?"))
      return;

    await supabase
      .from("product_option_values")
      .delete()
      .eq("id", id);

    loadValues();
  }

    return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-5">

      <div className="flex items-center justify-between">

        {editing ? (

          <div className="flex flex-1 gap-3">

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="flex-1 rounded border px-3 py-2"
            />

            <button
              type="button"
              onClick={() => {
                onUpdate(name);
                setEditing(false);
              }}
              className="rounded bg-green-600 px-4 py-2 text-white"
            >
              Save
            </button>

            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setName(option.option_name);
              }}
              className="rounded bg-gray-500 px-4 py-2 text-white"
            >
              Cancel
            </button>

          </div>

        ) : (

          <>
            <h3 className="text-lg font-semibold text-white">
              {option.option_name}
            </h3>

            <div className="flex gap-2">

              <button
                type="button"
                onClick={() => setEditing(true)}
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

      <div className="mt-5">

        <button
          type="button"
          onClick={() =>
            setShowAddValue(!showAddValue)
          }
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          {showAddValue
            ? "Cancel"
            : "+ Add Value"}
        </button>

      </div>

      {showAddValue && (

        <div className="mt-4 flex gap-3">

          <input
            value={valueName}
            onChange={(e) =>
              setValueName(e.target.value)
            }
            placeholder="Red"
            className="flex-1 rounded border px-3 py-2"
          />

          <button
            type="button"
            onClick={saveValue}
            className="rounded bg-green-600 px-5 py-2 text-white"
          >
            Save
          </button>

        </div>

      )}

      <div className="mt-5 space-y-2">

        {values.map((value) => (

          <VariantValueCard
            key={value.id}
            value={value}
            onDelete={() =>
              deleteValue(value.id)
            }
          />

        ))}

      </div>

    </div>
  );
}