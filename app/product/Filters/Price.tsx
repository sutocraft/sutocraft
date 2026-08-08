"use client";

type Props = {
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
};

export default function Price({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs text-gray-500">
          Minimum Price
        </label>

        <input
          type="number"
          min="0"
          value={minPrice}
          onChange={(e) =>
            onMinPriceChange(e.target.value)
          }
          placeholder="৳ Min"
          className="h-10 w-full rounded-xl border border-[#E8E1CE] px-3 text-sm text-[#2B2B2B] outline-none focus:border-[#98691D]"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-gray-500">
          Maximum Price
        </label>

        <input
          type="number"
          min="0"
          value={maxPrice}
          onChange={(e) =>
            onMaxPriceChange(e.target.value)
          }
          placeholder="৳ Max"
          className="h-10 w-full rounded-xl border border-[#E8E1CE] px-3 text-sm text-[#2B2B2B] outline-none focus:border-[#98691D]"
        />
      </div>
    </div>
  );
}