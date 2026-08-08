"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { useTheme } from "@/app/components/website/settings.theme_color";

type Props = {
  total: number;
};

export default function ProductsHeader({
  total,
}: Props) {
  const { themeColor } = useTheme();

  return (
    <section className="border-b bg-white">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">

        {/* Breadcrumb */}

        <div className="text-sm text-gray-500">
          Home
          <span className="mx-2">/</span>
          <span
            className="font-semibold"
            style={{
              color: themeColor,
            }}
          >
            Products
          </span>
        </div>

        {/* Title */}

        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

          <div>

            <p
              className="text-xs font-semibold uppercase tracking-[0.35em]"
              style={{
                color: themeColor,
              }}
            >
              OUR COLLECTION
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#2B2B2B] lg:text-5xl">
              Premium Collection
            </h1>

            <p className="mt-3 text-gray-500">
              {total} Products Available
            </p>

          </div>

          {/* Search + Filter */}

          <div className="flex flex-col gap-3 sm:flex-row">

            <div className="relative">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search products..."
                className="h-12 w-full rounded-2xl border border-[#E8E1CE] bg-white pl-11 pr-4 outline-none transition-all focus:border-[#98691D] sm:w-[320px]"
              />

            </div>

            <button
              className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#E8E1CE] bg-white px-5 transition-all hover:shadow-md"
            >
              <SlidersHorizontal
                size={18}
                style={{
                  color: themeColor,
                }}
              />

              <span
                className="font-medium"
                style={{
                  color: themeColor,
                }}
              >
                Filters
              </span>

            </button>

          </div>

        </div>

      </div>
    </section>
  );
}