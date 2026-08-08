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
        <div
          className="
            mb-4
            pt-5
            text-sm
            text-gray-500

            sm:mb-5
            sm:pt-6

            lg:mb-4
            lg:pt-5

            xl:mb-6
            xl:pt-8
          "
        >
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

        {/* Responsive Header Layout */}
        <div
          className="
            grid
            grid-cols-1
            gap-0

            lg:grid-cols-[minmax(0,1fr)_320px]
            lg:gap-x-6

            xl:grid-cols-[minmax(0,1fr)_360px]
            xl:gap-x-8
          "
        >

          {/* OUR COLLECTION + TITLE */}
          <div
            className="
              order-1
              lg:col-start-1
              lg:row-start-1
            "
          >
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

          {/* SEARCH */}
          <div
            className="
              relative
              order-2
              mt-4
              w-full

              lg:col-start-2
              lg:row-start-1
              lg:mt-0
              lg:self-start

              xl:mt-0
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

          {/* DESCRIPTION */}
          <p
            className="
              order-3
              mt-3
              text-sm
              text-[#6B7280]

              sm:text-base

              lg:col-start-1
              lg:row-start-5
              lg:mt-2

              xl:row-start-2
              xl:mt-2
            "
          >
            Discover our latest collection of premium products.
          </p>

          {/* SORT */}
          <div
            className="
              order-5
              mt-4
              flex
              justify-start

              lg:col-start-2
              lg:row-start-3
              lg:mt-3
              lg:justify-end

              xl:row-start-3
              xl:mt-5
            "
          >
            <ProductsSort
              selected={sort}
              onChange={onSortChange}
            />
          </div>

          {/* PRODUCT COUNT */}
          <div
            className="
              order-4
              mt-5
              border-t
              border-[#F0EBE0]
              pt-4

              lg:col-start-2
              lg:row-start-4
              lg:mt-3
              lg:border-t-0
              lg:pt-0

              xl:col-start-1
              xl:row-start-3
              xl:mt-5
              xl:pt-4
            "
          >
            <p className="text-sm text-[#6B7280]">
              Showing{" "}
              <span className="font-semibold text-[#2B2B2B]">
                {total}
              </span>{" "}
              products
            </p>
          </div>

          {/* MOBILE FILTER + SORT */}
          <div
            className="
              order-6
              mt-4
              flex
              w-full
              flex-row
              gap-2
              pb-4

              lg:hidden
            "
          >

            {/* Filter */}
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

            {/* Mobile Newest */}
            <div className="flex-1">
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