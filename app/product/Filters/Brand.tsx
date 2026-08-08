"use client";

import type { WebsiteProduct } from "@/lib/products";

type Props = {
  products: WebsiteProduct[];
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
};

export default function Brand({
  products,
  selectedBrand,
  onBrandChange,
}: Props) {
  const brands = Array.from(
    new Set(
      products
        .map((product) => product.brand?.name)
        .filter(Boolean)
    )
  ).sort();

  return (
    <div className="space-y-2">
      <label className="flex cursor-pointer items-center gap-3 text-sm text-[#4B5563]">
        <input
          type="radio"
          name="brand"
          checked={selectedBrand === ""}
          onChange={() => onBrandChange("")}
          className="h-4 w-4 accent-[#98691D]"
        />

        <span>All Brands</span>
      </label>

      {brands.map((brand) => (
        <label
          key={brand}
          className="flex cursor-pointer items-center gap-3 text-sm text-[#4B5563]"
        >
          <input
            type="radio"
            name="brand"
            checked={selectedBrand === brand}
            onChange={() => onBrandChange(brand)}
            className="h-4 w-4 accent-[#98691D]"
          />

          <span>{brand}</span>
        </label>
      ))}
    </div>
  );
}