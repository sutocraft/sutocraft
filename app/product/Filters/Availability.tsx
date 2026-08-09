"use client";

type AvailabilityValue =
  | "all"
  | "in-stock"
  | "out-of-stock";

type Props = {
  value: AvailabilityValue;
  onChange: (value: AvailabilityValue) => void;
};

export default function Availability({
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="flex cursor-pointer items-center gap-3 text-sm text-[#4B5563]">
        <input
          type="radio"
          name="availability"
          checked={value === "all"}
          onChange={() => onChange("all")}
          className="h-4 w-4 accent-[var(--theme-color)]"
        />

        <span>All Products</span>
      </label>

      <label className="flex cursor-pointer items-center gap-3 text-sm text-[#4B5563]">
        <input
          type="radio"
          name="availability"
          checked={value === "in-stock"}
          onChange={() => onChange("in-stock")}
          className="h-4 w-4 accent-[var(--theme-color)]"
        />

        <span>In Stock</span>
      </label>

      <label className="flex cursor-pointer items-center gap-3 text-sm text-[#4B5563]">
        <input
          type="radio"
          name="availability"
          checked={value === "out-of-stock"}
          onChange={() =>
            onChange("out-of-stock")
          }
          className="h-4 w-4 accent-[var(--theme-color)]"
        />

        <span>Out of Stock</span>
      </label>
    </div>
  );
}