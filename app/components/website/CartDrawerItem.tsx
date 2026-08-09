"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

type Props = {
  item: any;
  themeColor: string;
  loading: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export default function CartDrawerItem({
  item,
  themeColor,
  loading,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) {
  const product = item.products;

const image =
  product?.image_url?.trim() ||
  "/images/no-image.png";

const price =
  product?.sale_price ??
  product?.price ??
  0;

const regularPrice =
  product?.price ?? 0;

  return (
    <div className="flex gap-4 py-4 border-b border-[var(--theme-primary-border)]">
      {/* Image */}
      <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-[var(--theme-background)] shadow-sm sm:h-24 sm:w-24 flex items-center justify-center">
        <Image
  src={image}
  alt={product?.name ?? "Product"}
  width={96}
  height={96}
  unoptimized
  className="h-full w-full object-contain p-2 transition-transform duration-300"
/>
      </div>

      {/* Details */}
      <div className="flex-1">
        <h3 className="line-clamp-2 text-base font-semibold leading-6 text-[#1F2937]">
          {product?.name}
        </h3>

        {item.sizes?.name && (
          <p className="text-sm text-gray-500 mt-1">
            Size : {item.sizes.name}
          </p>
        )}

        {item.colors?.name && (
  <p className="mt-1 text-sm text-gray-500">
    Color :
    <span className="ml-1 font-medium text-[#1F2937]">
      {item.colors.name}
    </span>
  </p>
)}

        <div className="mt-2">
          <span style={{
  color: themeColor,
}}
className="text-xl font-bold">
  ৳{price}
</span>

          {regularPrice > price && (
  <span className="ml-2 text-sm text-gray-400 line-through">
    ৳{regularPrice}
  </span>
)}
        </div>

        {/* Qty */}
        <div className="flex items-center justify-between mt-3">
  <div
    className="flex items-center overflow-hidden rounded-xl"
    style={{
      border: "1px solid var(--theme-color-30)",
      opacity: loading ? 0.6 : 1,
    }}
  >
    <button
      onClick={onDecrease}
      disabled={loading}
      className="flex h-11 w-11 items-center justify-center transition active:scale-95 disabled:cursor-not-allowed"
      style={{
        color: themeColor,
      }}
    >
      <Minus size={16} />
    </button>

    <div
      className="w-12 text-center text-base font-bold"
      style={{
        color: themeColor,
      }}
    >
      {loading ? "..." : item.quantity}
    </div>

    <button
      onClick={onIncrease}
      disabled={loading}
      className="w-9 h-9 flex items-center justify-center transition disabled:cursor-not-allowed"
      style={{
        color: themeColor,
      }}
    >
      <Plus size={16} />
    </button>
  </div>

  <button
    onClick={onRemove}
    disabled={loading}
    className="transition disabled:cursor-not-allowed"
    style={{
      color: themeColor,
      opacity: loading ? 0.5 : 1,
    }}
  >
    <Trash2 size={20} />
  </button>
</div>
      </div>
    </div>
  );
}