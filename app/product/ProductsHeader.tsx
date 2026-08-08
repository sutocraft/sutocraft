"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { useTheme } from "@/app/components/website/settings.theme_color";
import ProductsSort from "./ProductsSort";

type SortOption =
  | "Newest"
  | "Price: Low to High"
  | "Price: High to Low"
  | "Name: A to Z"
  | "Name: Z to A";

type Props = {
  total: number;
  search: string;
  onSearchChange: (value: string) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  onMobileFilter: () => void;
};

export default function ProductsHeader({
  total,
  search,
  onSearchChange,
  sort,
  onSortChange,
  onMobileFilter,
}: Props) {
  const { themeColor } = useTheme();

  return (
    <section className="border-b border-[#E8E1CE] bg-white">
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-500">
          <span>Home</span>

          <span className="mx-2 text-gray-300">
            /
          </span>

          <span
            className="font-semibold"
            style={{
              color: themeColor,
            }}
          >
            Products
          </span>
        </div>

        {/* Main Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

          {/* Title */}
          <div>
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.35em]
                sm:text-sm
              "
              style={{
                color: themeColor,
              }}
            >
              OUR COLLECTION
            </p>

            <h1
              className="
                mt-2
                text-3xl
                font-bold
                leading-tight
                text-[#2B2B2B]
                sm:text-4xl
                lg:text-5xl
              "
            >
              Premium Collection
            </h1>

            <p className="mt-3 text-sm text-[#6B7280] sm:text-base">
              Discover our latest collection of premium products.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full lg:max-w-[360px]">
            <Search
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                onSearchChange(e.target.value)
              }
              placeholder="Search products..."
              className="
                h-12
                w-full
                rounded-2xl
                border
                border-[#E8E1CE]
                bg-white
                pl-11
                pr-4
                text-sm
                text-[#2B2B2B]
                outline-none
                transition-all
                duration-200
                placeholder:text-gray-400
                focus:shadow-sm
              "
              onFocus={(e) => {
                e.currentTarget.style.borderColor =
                  themeColor;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor =
                  "#E8E1CE";
              }}
            />
          </div>
        </div>

        {/* Bottom Controls */}
        <div
          className="
            mt-7
            flex
            flex-col
            gap-3
            border-t
            border-[#F0EBE0]
            pt-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* Product Count */}
          <p className="text-sm text-[#6B7280]">
            Showing{" "}
            <span className="font-semibold text-[#2B2B2B]">
              {total}
            </span>{" "}
            products
          </p>

          {/* Controls */}
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">

            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={onMobileFilter}
              className="
                flex
                h-12
                items-center
                justify-center
                gap-2
                rounded-2xl
                border
                border-[#E8E1CE]
                bg-white
                px-5
                text-sm
                font-semibold
                transition-all
                duration-200
                hover:shadow-md
                lg:hidden
              "
              style={{
                color: themeColor,
              }}
            >
              <SlidersHorizontal size={17} />

              <span>
                Filters
              </span>
            </button>

            {/* Sort */}
            <ProductsSort
              selected={sort}
              onChange={onSortChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
}