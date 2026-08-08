"use client";

import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";

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
    pt-4
    pb-3
    sm:pt-5
    sm:pb-4
    lg:pt-8
    lg:pb-6
  "
>
          {/* Breadcrumb */}
          <div
  className="
    mb-2
    flex
    items-center
    gap-2
    text-sm
    text-[#64748B]
  "
>
            <span>Home</span>

            <span className="text-[#CBD5E1]">/</span>

            <span className="font-semibold text-[#98691D]">
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
                  text-[#98691D]
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
    mt-1
    text-sm
    leading-5
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
                    border-[#E8E1CE]
                    bg-white
                    pl-11
                    pr-4
                    text-sm
                    text-[#2B2B2B]
                    outline-none
                    transition
                    placeholder:text-[#94A3B8]
                    focus:border-[#98691D]
                    focus:ring-2
                    focus:ring-[#98691D]/10
                  "
                />
              </div>

              {/* Sort */}
              <div className="relative w-[180px] shrink-0">
                <ArrowUpDown
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-[#98691D]
                  "
                />

                <select
                  value={sort}
                  onChange={(e) =>
                    onSortChange(
                      e.target.value as SortOption
                    )
                  }
                  className="
                    h-12
                    w-full
                    appearance-none
                    rounded-2xl
                    border
                    border-[#E8E1CE]
                    bg-white
                    pl-9
                    pr-9
                    text-sm
                    font-medium
                    text-[#2B2B2B]
                    outline-none
                    focus:border-[#98691D]
                    focus:ring-2
                    focus:ring-[#98691D]/10
                  "
                >
                  <option value="Newest">
                    Newest
                  </option>

                  <option value="Price: Low to High">
                    Price: Low to High
                  </option>

                  <option value="Price: High to Low">
                    Price: High to Low
                  </option>

                  <option value="Name: A to Z">
                    Name: A to Z
                  </option>

                  <option value="Name: Z to A">
                    Name: Z to A
                  </option>
                </select>

                <ChevronDown
                  size={16}
                  className="
                    pointer-events-none
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-[#94A3B8]
                  "
                />
              </div>
            </div>
          </div>

          {/* =================================================
              MOBILE SEARCH
             ================================================= */}
          <div className="mt-3 lg:hidden">
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
                  h-10
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
                  transition
                  placeholder:text-[#94A3B8]
                  focus:border-[#98691D]
                  focus:ring-2
                  focus:ring-[#98691D]/10
                "
              />
            </div>
          </div>
        </div>

        {/* =====================================================
            COUNT ROW
            Desktop:
            Premium Collection        Showing 10 products

            Mobile:
            Showing 10 products
            Filters + Newest
           ===================================================== */}
        <div
          className="
  flex
  flex-col
  gap-2
  pb-2
  sm:pb-3
  lg:flex-row
  lg:items-end
  lg:justify-between
"
        >
          

          {/* MOBILE CONTROLS */}
<div className="flex w-full items-center gap-3 lg:hidden">

  {/* Filters */}
  <button
    type="button"
    onClick={onMobileFilter}
    className="
      flex
      h-9
      min-w-0
      flex-1
      items-center
      justify-center
      gap-2
      rounded-2xl
      border
      border-[#E8E1CE]
      bg-white
      px-2
      text-sm
      font-semibold
      text-[#98691D]
      transition
      hover:bg-[#98691D]/5
    "
  >
    <SlidersHorizontal size={17} />
    <span>Filters</span>
  </button>

  {/* Newest / Sort */}
  <div className="relative flex-1">
    <ArrowUpDown
      size={17}
      className="
        pointer-events-none
        absolute
        left-3
        top-1/2
        -translate-y-1/2
        text-[#98691D]
      "
    />

    <select
      value={sort}
      onChange={(e) =>
        onSortChange(e.target.value as SortOption)
      }
      className="
        h-9
        w-full
        appearance-none
        rounded-2xl
        border
        border-[#E8E1CE]
        bg-white
        pl-9
        pr-8
        text-sm
        font-medium
        text-[#2B2B2B]
        outline-none
        focus:border-[#98691D]
        focus:ring-2
        focus:ring-[#98691D]/10
      "
    >
      <option value="Newest">Newest</option>

      <option value="Price: Low to High">
        Price: Low to High
      </option>

      <option value="Price: High to Low">
        Price: High to Low
      </option>

      <option value="Name: A to Z">
        Name: A to Z
      </option>

      <option value="Name: Z to A">
        Name: Z to A
      </option>
    </select>

    <ChevronDown
      size={16}
      className="
        pointer-events-none
        absolute
        right-3
        top-1/2
        -translate-y-1/2
        text-[#94A3B8]
      "
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

        {/* DIVIDER */}
        <div className="border-t border-[#EEE8DD]" />
      </div>
    </section>
  );
}