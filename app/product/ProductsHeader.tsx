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
          max-w-[1440px]
          px-4
          sm:px-6
          lg:px-8
          xl:px-10
        "
      >
        {/* TOP */}
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
              mb-4
              flex
              items-center
              gap-2
              text-sm
              text-[#64748B]
            "
          >
            <span>Home</span>

            <span className="text-[#CBD5E1]">
              /
            </span>

            <span className="font-semibold text-[#98691D]">
              Products
            </span>
          </div>

          {/* TITLE + SEARCH */}
          <div
            className="
              grid
              grid-cols-1
              gap-4

              lg:grid-cols-[minmax(0,1fr)_340px]
              lg:items-end

              xl:grid-cols-[minmax(0,1fr)_380px]
            "
          >
            {/* Title */}
            <div>
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

              <h1
                className="
                  mt-1
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
            </div>

            {/* Search */}
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
                  onSearchChange(
                    e.target.value
                  )
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
          </div>

          {/* DESCRIPTION */}
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

        {/* DIVIDER */}
        <div className="border-t border-[#EEE8DD]" />

        {/* BOTTOM */}
        <div
          className="
            flex
            flex-col
            gap-4
            py-4

            sm:py-5

            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {/* COUNT */}
          <p className="text-sm text-[#64748B]">
            Showing{" "}
            <span className="font-semibold text-[#2B2B2B]">
              {total}
            </span>{" "}
            products
          </p>

          {/* CONTROLS */}
          <div
            className="
              flex
              w-full
              items-center
              gap-3

              lg:w-auto
            "
          >
            {/* MOBILE FILTER */}
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
                border-[#E8E1CE]
                bg-white
                px-3
                text-sm
                font-semibold
                text-[#98691D]
                transition
                hover:bg-[#98691D]/5

                lg:hidden
              "
            >
              <SlidersHorizontal size={17} />

              <span>
                Filters
              </span>
            </button>

            {/* SORT */}
            <div
              className="
                relative
                w-[150px]
                shrink-0

                sm:w-[170px]

                lg:w-[200px]
              "
            >
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
                  h-11
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
      </div>
    </section>
  );
}