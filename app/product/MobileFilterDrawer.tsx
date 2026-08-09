"use client";

import { X } from "lucide-react";

import ProductsFilter from "./ProductsFilter";

import type { WebsiteProduct } from "@/lib/products";

type Props = {
  open: boolean;
  onClose: () => void;

  products: WebsiteProduct[];

  selectedCategory: string;
  onCategoryChange: (category: string) => void;

  selectedBrand: string;
  onBrandChange: (brand: string) => void;

  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;

  availability: "all" | "in-stock" | "out-of-stock";
  onAvailabilityChange: (
    value: "all" | "in-stock" | "out-of-stock"
  ) => void;

  onReset: () => void;
};

export default function MobileFilterDrawer({
  open,
  onClose,
  products,
  selectedCategory,
  onCategoryChange,
  selectedBrand,
  onBrandChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  availability,
  onAvailabilityChange,
  onReset,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">

      {/* Overlay */}
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* Drawer */}
      <div
        className="
          absolute
          right-0
          top-0
          h-full
          w-[88%]
          max-w-[420px]
          overflow-y-auto
          bg-[var(--theme-background)]
          shadow-2xl
        "
      >
        {/* Drawer Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--theme-primary-border)] bg-white px-5 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--theme-color)]">
              Filter
            </p>

            <h2 className="mt-1 text-lg font-semibold text-[#2B2B2B]">
              Shop By
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--theme-primary-border)] bg-white text-gray-500 transition hover:text-[var(--theme-color)]"
          >
            <X size={19} />
          </button>
        </div>

        {/* Filter */}
        <div className="p-4">
          <ProductsFilter
            products={products}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
            selectedBrand={selectedBrand}
            onBrandChange={onBrandChange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={onMinPriceChange}
            onMaxPriceChange={onMaxPriceChange}
            availability={availability}
            onAvailabilityChange={onAvailabilityChange}
            onReset={onReset}
          />

          {/* Done */}
          <button
            type="button"
            onClick={onClose}
            className="mt-4 w-full rounded-xl bg-[var(--theme-color)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}