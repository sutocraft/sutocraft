"use client";

import type { WebsiteProduct } from "@/lib/products";

type Props = {
  products: WebsiteProduct[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
};

export default function Category({
  products,
  selectedCategory,
  onCategoryChange,
}: Props) {
  const categories = Array.from(
    new Set(
      products
        .map((product) => product.category?.name)
        .filter(Boolean)
    )
  ).sort();

  return (
    <div className="space-y-2">
      <label className="flex cursor-pointer items-center gap-3 text-sm text-[#4B5563]">
        <input
          type="radio"
          name="category"
          checked={selectedCategory === ""}
          onChange={() => onCategoryChange("")}
          className="h-4 w-4 accent-[#98691D]"
        />

        <span>All Categories</span>
      </label>

      {categories.map((category) => (
        <label
          key={category}
          className="flex cursor-pointer items-center gap-3 text-sm text-[#4B5563]"
        >
          <input
            type="radio"
            name="category"
            checked={selectedCategory === category}
            onChange={() => {
  if (category) {
    onCategoryChange(category);
  }
}}
            className="h-4 w-4 accent-[#98691D]"
          />

          <span>{category}</span>
        </label>
      ))}
    </div>
  );
}