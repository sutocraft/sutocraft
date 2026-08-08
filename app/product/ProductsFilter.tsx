"use client";

import { ChevronDown, RotateCcw } from "lucide-react";
import { useState } from "react";

import { useTheme } from "@/app/components/website/settings.theme_color";

const filterSections = [
  {
    title: "Category",
    options: [
      "Men",
      "Woman",
    ],
  },
  {
    title: "Brand",
    options: [],
  },
  {
    title: "Price",
    options: [
      "Under ৳1,000",
      "৳1,000 - ৳2,000",
      "৳2,000 - ৳3,000",
      "Above ৳3,000",
    ],
  },
  {
    title: "Availability",
    options: [
      "In Stock",
      "Out of Stock",
    ],
  },
];

export default function ProductsFilter() {
  const { themeColor } = useTheme();

  const [openSection, setOpenSection] =
    useState<string | null>("Category");

  function toggleSection(title: string) {
    setOpenSection((current) =>
      current === title ? null : title
    );
  }

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 rounded-3xl border border-[#E8E1CE] bg-white p-5 shadow-sm">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.25em]"
              style={{
                color: themeColor,
              }}
            >
              FILTER
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#2B2B2B]">
              Shop By
            </h2>
          </div>

          <button
            type="button"
            className="flex items-center gap-1 text-xs font-semibold text-gray-500 transition-colors hover:text-[#2B2B2B]"
          >
            <RotateCcw size={13} />
            Reset
          </button>

        </div>

        {/* Divider */}

        <div className="my-5 h-px bg-[#E8E1CE]" />

        {/* Filter Sections */}

        <div className="space-y-1">

          {filterSections.map((section) => {

            const isOpen =
              openSection === section.title;

            return (
              <div
                key={section.title}
                className="border-b border-[#F0EBE0] last:border-b-0"
              >

                <button
                  type="button"
                  onClick={() =>
                    toggleSection(section.title)
                  }
                  className="flex w-full items-center justify-between py-4 text-left"
                >
                  <span className="text-sm font-semibold text-[#2B2B2B]">
                    {section.title}
                  </span>

                  <ChevronDown
                    size={17}
                    className={`text-gray-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen
                      ? "max-h-80 pb-4 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {section.options.length > 0 ? (
                    <div className="space-y-3">

                      {section.options.map(
                        (option) => (
                          <label
                            key={option}
                            className="group flex cursor-pointer items-center gap-3"
                          >
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 accent-[#98691D]"
                            />

                            <span className="text-sm text-gray-500 transition-colors group-hover:text-[#2B2B2B]">
                              {option}
                            </span>
                          </label>
                        )
                      )}

                    </div>
                  ) : (
                    <p className="text-xs leading-5 text-gray-400">
                      No options available.
                    </p>
                  )}
                </div>

              </div>
            );
          })}

        </div>

        {/* Apply Button */}

        <button
          type="button"
          className="mt-5 flex h-11 w-full items-center justify-center rounded-2xl px-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          style={{
            background: themeColor,
          }}
        >
          Apply Filters
        </button>

      </div>
    </aside>
  );
}