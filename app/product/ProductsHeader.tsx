"use client";

import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

import type { ReactNode } from "react";

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

  desktopFilter?: ReactNode;
};

export default function ProductsHeader({
  total,
  search,
  onSearchChange,
  sort,
  onSortChange,
  onMobileFilter,
  desktopFilter,
}: Props) {
  return (
    <section className="bg-white">
      <div
        className="
          mx-auto
          w-full
          max-w-[1280px]
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* =====================================================
            TOP SECTION
            Desktop:
            Left  = Collection + Title + Description
            Right = Search + Sort
           ===================================================== */}
        <div
          className="
            pt-6
            pb-5
            sm:pt-7
            sm:pb-6
            lg:pt-8
            lg:pb-6
          "
        >
          {/* Breadcrumb */}
          <div
            className="
              mb-0
              flex
              items-center
              gap-2
              text-sm
              text-[#64748B]
            "
          >
            <span>Home</span>

            <span className="text-[#CBD5E1]">/</span>

            <span className="font-semibold text-[var(--theme-color)]">
              Products
            </span>
          </div>

          {/* =================================================
              DESKTOP MAIN HEADER
             ================================================= */}
          <div
            className="
              relative
              grid
              grid-cols-1
              gap-4
              lg:grid-cols-[minmax(0,1fr)_520px]
              lg:items-start
            "
          >
            {/* LEFT CONTENT */}
            <div className="min-w-0">
              {/* Collection Label */}
              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.32em]
                  text-[var(--theme-color)]
                  sm:text-sm
                "
              >
                OUR COLLECTION
              </p>

              {/* Title + Count */}
              <div className="flex items-end justify-between gap-4">
                <h1
                  className="
                    mt-1
                    min-w-0
                    text-3xl
                    font-bold
                    leading-tight
                    tracking-tight
                    text-[#2B2B2B]
                    sm:text-4xl
                    lg:text-[42px]
                    xl:text-5xl
                  "
                >
                  Premium Collection
                </h1>

                {/* Desktop Count */}
                <p
                  className="
                    hidden
                    lg:block
                    absolute
                    right-0
                    top-[88px]
                    text-right
                    text-sm
                    text-[#64748B]
                  "
                >
                  Showing{" "}
                  <span className="font-semibold text-[#2B2B2B]">
                    {total}
                  </span>{" "}
                  products
                </p>
              </div>

              {/* Description */}
              <p
                className="
                  mt-3
                  text-sm
                  leading-6
                  text-[#64748B]
                  sm:text-base
                "
              >
                Discover our latest collection of premium products.
              </p>
            </div>

            {/* RIGHT CONTROLS */}
            <div
              className="
                hidden
                w-full
                items-start
                justify-end
                gap-3
                lg:flex
              "
            >
              {/* Search */}
              <div className="relative min-w-0 flex-1">
                <Search
                  size={18}
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-[#94A3B8]
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
                    border-[var(--theme-primary-border)]
                    bg-white
                    pl-11
                    pr-4
                    text-sm
                    text-[#2B2B2B]
                    outline-none
                    transition
                    placeholder:text-[#94A3B8]
                    focus:border-[var(--theme-color)]
                    focus:ring-2
                    focus:ring-[var(--theme-color-10)]
                  "
                />
              </div>

              {/* Sort */}
              <div className="relative w-[180px] shrink-0">
                <ProductsSort
                  selected={sort}
                  onChange={onSortChange}
                />
              </div>
            </div>
          </div>

          {/* =================================================
              MOBILE SEARCH
             ================================================= */}
          <div className="mt-4 lg:hidden">
            <div className="relative w-full">
              <Search
                size={18}
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-[#94A3B8]
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
                  border-[var(--theme-primary-border)]
                  bg-white
                  pl-11
                  pr-4
                  text-sm
                  text-[#2B2B2B]
                  outline-none
                  transition
                  placeholder:text-[#94A3B8]
                  focus:border-[var(--theme-color)]
                  focus:ring-2
                  focus:ring-[var(--theme-color-10)]
                "
              />
            </div>
          </div>
        </div>

        {/* =====================================================
            MOBILE CONTROLS
           ===================================================== */}
        <div
          className="
            flex
            flex-col
            gap-4
            pb-4
            sm:pb-5
            lg:hidden
          "
        >
          <div className="flex w-full items-center gap-3">
            {/* Filters */}
            <button
              type="button"
              onClick={onMobileFilter}
              className="
                flex
                h-11
                min-w-0
                flex-1
                items-center
                justify-center
                gap-2
                rounded-2xl
                border
                border-[var(--theme-primary-border)]
                bg-white
                px-2
                text-sm
                font-semibold
                text-[var(--theme-color)]
                transition
                hover:bg-[color:var(--theme-color)]/5
              "
            >
              <SlidersHorizontal size={17} />
              <span>Filters</span>
            </button>

            {/* Newest / Sort */}
            <div className="relative flex-1 min-w-0">
              <ProductsSort
                selected={sort}
                onChange={onSortChange}
              />
            </div>

            {/* Showing Count */}
            <p className="shrink-0 whitespace-nowrap text-xs text-[#64748B]">
              Showing{" "}
              <span className="font-semibold text-[#2B2B2B]">
                {total}
              </span>{" "}
              products
            </p>
          </div>
        </div>

        {/* =====================================================
            DESKTOP FILTER
            Filter will appear inside this same white panel
           ===================================================== */}
        {desktopFilter && (
  <div className="hidden border-t border-[#EEE8DD] pb-2 pt-2 lg:block">
    {desktopFilter}
  </div>
)}

        {/* DIVIDER */}
        <div className="border-t border-[#EEE8DD]" />
      </div>
    </section>
  );
}