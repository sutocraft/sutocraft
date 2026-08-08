"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { useTheme } from "@/app/components/website/settings.theme_color";
import ProductsSort from "./ProductsSort";
import Container from "@/app/components/website/Container";

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
      <Container>

        {/* Breadcrumb */}
        <div className="mb-3 pt-4 text-sm text-gray-500 sm:mb-4 sm:pt-6 lg:mb-4 lg:pt-5 xl:mb-6 xl:pt-8">
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
<div
  className="
    grid
    grid-cols-1
    gap-4
    lg:grid-cols-[minmax(0,1fr)_320px]
    lg:items-start
    lg:gap-6
    xl:grid-cols-[minmax(0,1fr)_360px]
    xl:gap-8
  "
>
  {/* Title */}
  <div className="lg:contents">
    <div className="lg:order-1">
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
          mt-1.5
          text-3xl
          font-bold
          leading-tight
          text-[#2B2B2B]
          sm:mt-2
          sm:text-4xl
          lg:text-4xl
          xl:text-5xl
        "
      >
        Premium Collection
      </h1>
    </div>

    {/* Search */}
    <div
      className="
        relative
        w-full
        lg:order-2
        lg:row-span-2
        lg:self-start
      "
    >
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
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search products..."
        className="
          h-11
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
          sm:h-12
        "
        onFocus={(e) => {
          e.currentTarget.style.borderColor = themeColor;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#E8E1CE";
        }}
      />
    </div>

    {/* Description */}
    <p
      className="
        mt-1
        text-sm
        text-[#6B7280]
        sm:text-base
        lg:order-5
        lg:mt-0
      "
    >
      Discover our latest collection of premium products.
    </p>
  </div>
</div>

        {/* Bottom Controls */}
<div
  className="
    mt-4
    flex
    flex-col
    gap-3
    border-t
    border-[#F0EBE0]
    py-4

    sm:mt-5

    lg:mt-3
    lg:items-start

    xl:mt-6
    xl:flex-row
    xl:items-center
    xl:justify-between
  "
>
  {/* Product Count */}
  <p
    className="
      order-3
      text-sm
      text-[#6B7280]

      lg:order-2
      xl:order-1
    "
  >
    Showing{" "}
    <span className="font-semibold text-[#2B2B2B]">
      {total}
    </span>{" "}
    products
  </p>

  {/* Controls */}
  <div
    className="
      order-1
      flex
      w-full
      flex-row
      gap-2

      lg:order-1
      lg:w-full
      lg:flex-col
      lg:gap-2

      xl:order-2
      xl:w-auto
      xl:flex-row
      xl:gap-3
    "
  >
    {/* Mobile Filter */}
    <button
      type="button"
      onClick={onMobileFilter}
      className="
        flex
        h-11
        flex-1
        items-center
        justify-center
        gap-2
        rounded-2xl
        border
        border-[#E8E1CE]
        bg-white
        px-4
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

      <span>Filters</span>
    </button>

    {/* Sort */}
    <div
      className="
        flex-1

        lg:w-full

        xl:flex-none
      "
    >
      <ProductsSort
        selected={sort}
        onChange={onSortChange}
      />
    </div>
  </div>
</div>

      </Container>
    </section>
  );
}