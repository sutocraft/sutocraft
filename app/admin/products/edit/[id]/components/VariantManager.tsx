"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import VariantOptionCard from "./VariantOptionCard";

type ProductOption = {
  id: string;
  product_id: string;
  option_name: string;
};

type Props = {
  productId: string;
};

export default function VariantManager({
  productId,
}: Props) {
  const [loading, setLoading] = useState(false);

type ProductVariant = {
  id?: string;

  title: string;

  sku: string;

  price: number;

  sale_price: number;

  stock: number;

  image: string;

  enabled: boolean;
};

const [variants, setVariants] =
  useState<ProductVariant[]>([]);

  const [options, setOptions] = useState<ProductOption[]>([]);

  const [showAddOption, setShowAddOption] =
    useState(false);

  const [optionName, setOptionName] =
    useState("");

  useEffect(() => {
    loadOptions();
  }, []);

  async function loadOptions() {
    setLoading(true);

    const { data, error } = await supabase
      .from("product_options")
      .select("*")
      .eq("product_id", productId)
      .order("created_at");

    if (!error) {
      setOptions(data || []);
    }

    setLoading(false);

generateVariants();
  }

  async function saveOption() {
    if (!optionName.trim()) return;

    const { error } = await supabase
      .from("product_options")
      .insert({
        product_id: productId,
        option_name: optionName.trim(),
      });

    if (error) {
      alert(error.message);
      return;
    }

    setOptionName("");
    setShowAddOption(false);

    loadOptions();
  }

  async function deleteOption(id: string) {
    if (!confirm("Delete this option?")) return;

    await supabase
      .from("product_option_values")
      .delete()
      .eq("option_id", id);

    await supabase
      .from("product_options")
      .delete()
      .eq("id", id);

    loadOptions();
  }

  async function generateVariants() {

  const { data: optionData } =
    await supabase
      .from("product_options")
      .select(`
  *,
  product_option_values(
    id,
    value,
    sort_order
  )
`)
.eq("product_id", productId);

  if (!optionData) return;

  if (optionData.length === 0) {

    setVariants([]);

    return;

  }

  let result: any[] = [{}];

  optionData.forEach((option: any) => {

    const temp: any[] = [];

    result.forEach((r: any) => {

      option.product_option_values.forEach(
        (value: any) => {

          temp.push({

            ...r,

            [option.option_name]:
              value.value,

          });

        }
      );

    });

    result = temp;

  });

  const generated = result.map(
    (item: any) => ({

      title:
        Object.values(item).join(" / "),

      sku: "",

      price: 0,

      sale_price: 0,

      stock: 0,

      image: "",

      enabled: true,

    })
  );

  setVariants(generated);

}

    async function updateOption(
    id: string,
    option_name: string
  ) {
    const { error } = await supabase
      .from("product_options")
      .update({
        option_name,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadOptions();
  }

  return (
    <div className="mt-8 rounded-xl border border-zinc-700 bg-zinc-900 p-6">

      <div className="flex items-center justify-between">

        <h2 className="text-xl font-semibold text-white">
          Product Options
        </h2>

        <button
          type="button"
          onClick={() =>
            setShowAddOption(!showAddOption)
          }
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {showAddOption
            ? "Cancel"
            : "+ Add Option"}
        </button>

      </div>

      {showAddOption && (

        <div className="mt-6 rounded border p-4">

          <div className="flex gap-3">

            <input
              type="text"
              placeholder="Color / Size / Material"
              value={optionName}
              onChange={(e) =>
                setOptionName(e.target.value)
              }
              className="flex-1 rounded border px-3 py-2"
            />

            <button
              type="button"
              onClick={saveOption}
              className="rounded bg-green-600 px-5 py-2 text-white"
            >
              Save
            </button>

          </div>

        </div>

      )}

      {loading ? (

        <div className="py-10 text-center">

          Loading...

        </div>

      ) : options.length === 0 ? (

        <div className="py-10 text-center text-gray-500">

          No options added yet.

        </div>

      ) : (

        <div className="mt-6 space-y-5">
{options.map((option) => (

  <VariantOptionCard
    key={option.id}
    option={option}
    onDelete={() =>
      deleteOption(option.id)
    }
    onUpdate={(name) =>
      updateOption(option.id, name)
    }
  />

))}

        </div>

      )}

    {variants.length > 0 && (

      <div className="mt-10">

        <h2 className="mb-4 text-xl font-semibold">
          Generated Variants
        </h2>

        <div className="overflow-auto">

          <table className="w-full border">

            <thead>

              <tr>
                <th className="border p-2">Variant</th>
                <th className="border p-2">SKU</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Stock</th>
              </tr>

            </thead>

            <tbody>

              {variants.map((variant, index) => (

                <tr key={index}>

                  <td className="border p-2">
                    {variant.title}
                  </td>

                  <td className="border p-2">
                    {variant.sku}
                  </td>

                  <td className="border p-2">
                    {variant.price}
                  </td>

                  <td className="border p-2">
                    {variant.stock}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    )}

    </div>

  );

}


