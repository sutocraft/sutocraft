"use client";

import {
  ArrowDownUp,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

import {
  useTheme,
} from "@/app/components/website/settings.theme_color";

const sortOptions = [
  "Newest",
  "Price: Low to High",
  "Price: High to Low",
  "Name: A to Z",
  "Name: Z to A",
] as const;

type SortOption =
  (typeof sortOptions)[number];

type Props = {
  selected: SortOption;
  onChange: (value: SortOption) => void;
};

export default function ProductsSort({
  selected,
  onChange,
}: Props) {
  const { themeColor } = useTheme();

  const [open, setOpen] = useState(false);

  function handleSelect(option: SortOption) {
    onChange(option);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() =>
          setOpen((value) => !value)
        }
        className="
          flex
          h-12
          min-w-[190px]
          items-center
          justify-between
          gap-3
          rounded-2xl
          border
          border-[#E8E1CE]
          bg-white
          px-4
          text-sm
          font-medium
          text-[#2B2B2B]
          shadow-sm
          transition-all
          duration-200
          hover:shadow-md
        "
      >
        <span className="flex items-center gap-2">
          <ArrowDownUp
            size={17}
            style={{
              color: themeColor,
            }}
          />

          <span>
            {selected}
          </span>
        </span>

        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="
            absolute
            right-0
            top-[calc(100%+8px)]
            z-50
            w-full
            min-w-[220px]
            overflow-hidden
            rounded-2xl
            border
            border-[#E8E1CE]
            bg-white
            p-2
            shadow-xl
          "
        >
          {sortOptions.map((option) => {
            const active =
              selected === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  handleSelect(option)
                }
                className="
                  flex
                  w-full
                  items-center
                  rounded-xl
                  px-3
                  py-3
                  text-left
                  text-sm
                  transition-colors
                  duration-200
                "
                style={{
                  background: active
                    ? `${themeColor}12`
                    : undefined,
                  color: active
                    ? themeColor
                    : "#2B2B2B",
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}