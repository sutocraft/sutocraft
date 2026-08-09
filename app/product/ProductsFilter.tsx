"use client";

import { useState } from "react";

import Category from "./Filters/Category";
import Brand from "./Filters/Brand";
import Price from "./Filters/Price";
import Availability from "./Filters/Availability";

import type { WebsiteProduct } from "@/lib/products";

type Props = {
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

export default function ProductsFilter({
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
  /*
   * All filter sections are collapsed by default.
   * User can open any section independently.
   */
  const [categoryOpen, setCategoryOpen] =
    useState(false);

  const [brandOpen, setBrandOpen] =
    useState(false);

  const [priceOpen, setPriceOpen] =
    useState(false);

  const [availabilityOpen, setAvailabilityOpen] =
    useState(false);

  return (
    <aside className="w-full">
      {/* =====================================================
          FILTER HEADER
         ===================================================== */}
      <div
        className="
          mb-2
          flex
          items-center
          justify-between
          border-b
          border-[var(--theme-primary-border)]
          pb-3
        "
      >
        <div>
          <p
            className="
              mb-1
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.25em]
              text-[var(--theme-color)]
            "
          >
            Filter
          </p>

          <h2
            className="
              text-lg
              font-semibold
              text-[#2B2B2B]
            "
          >
            Shop By
          </h2>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="
            text-xs
            font-medium
            text-gray-500
            transition
            hover:text-[var(--theme-color)]
          "
        >
          Reset
        </button>
      </div>

      {/* =====================================================
          DESKTOP FILTER GRID

          Category | Brand | Price | Availability
         ===================================================== */}
      <div
        className="
          grid
          grid-cols-1

          lg:grid-cols-4
          lg:divide-x
          lg:divide-[var(--theme-primary-border)]
        "
      >
        {/* ===================================================
            CATEGORY
           =================================================== */}
        <div
          className="
            lg:px-4
            lg:first:pl-0
          "
        >
          <FilterSection
            title="Category"
            open={categoryOpen}
            onToggle={() =>
              setCategoryOpen((value) => !value)
            }
          >
            <Category
              products={products}
              selectedCategory={selectedCategory}
              onCategoryChange={onCategoryChange}
            />
          </FilterSection>
        </div>

        {/* ===================================================
            BRAND
           =================================================== */}
        <div className="lg:px-4">
          <FilterSection
            title="Brand"
            open={brandOpen}
            onToggle={() =>
              setBrandOpen((value) => !value)
            }
          >
            <Brand
              products={products}
              selectedBrand={selectedBrand}
              onBrandChange={onBrandChange}
            />
          </FilterSection>
        </div>

        {/* ===================================================
            PRICE
           =================================================== */}
        <div className="lg:px-4">
          <FilterSection
            title="Price"
            open={priceOpen}
            onToggle={() =>
              setPriceOpen((value) => !value)
            }
          >
            <Price
              minPrice={minPrice}
              maxPrice={maxPrice}
              onMinPriceChange={onMinPriceChange}
              onMaxPriceChange={onMaxPriceChange}
            />
          </FilterSection>
        </div>

        {/* ===================================================
            AVAILABILITY
           =================================================== */}
        <div
          className="
            lg:px-4
            lg:last:pr-0
          "
        >
          <FilterSection
            title="Availability"
            open={availabilityOpen}
            onToggle={() =>
              setAvailabilityOpen((value) => !value)
            }
          >
            <Availability
              value={availability}
              onChange={onAvailabilityChange}
            />
          </FilterSection>
        </div>
      </div>
    </aside>
  );
}


/* ===========================================================
   FILTER SECTION
   =========================================================== */

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        border-t
        border-[var(--theme-primary-border)]
        pt-3

        first:border-t-0
        first:pt-0

        lg:border-t-0
        lg:pt-0
      "
    >
      <button
        type="button"
        onClick={onToggle}
        className="
          flex
          w-full
          items-center
          justify-between
          text-sm
          font-semibold
          text-[#2B2B2B]
        "
      >
        <span>{title}</span>

        <span
          className="
            text-xs
            text-gray-400
          "
        >
          {open ? "⌃" : "⌄"}
        </span>
      </button>

      {open && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  );
}