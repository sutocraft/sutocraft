"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

type Props = {
  item: any;
  themeColor: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export default function CartDrawerItem({
  item,
  themeColor,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) {
  const product = item.products;

const image =
  product?.image_url ||
  "/images/no-image.png";

const price =
  product?.sale_price ??
  product?.price ??
  0;

const regularPrice =
  product?.price ?? 0;

  return (
    <div className="flex gap-4 py-4 border-b border-[#e8dcc6]">
      {/* Image */}
      <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#f8f5ef] flex items-center justify-center shrink-0">
        <Image
  src={image}
  alt={product?.name ?? "Product"}
  width={96}
  height={96}
  unoptimized
  className="w-full h-full object-cover"
/>
      </div>

      {/* Details */}
      <div className="flex-1">
        <h3 className="font-semibold text-[#1f2937] leading-5">
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
className="text-lg font-bold">
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
  className="flex items-center rounded-lg overflow-hidden"
  style={{
    border: `1px solid ${themeColor}40`,
  }}
>
            <button
  onClick={onDecrease}
  className="w-9 h-9 flex items-center justify-center transition"
  style={{
    color: themeColor,
  }}
>
  <Minus size={16} />
</button>

            <div
  className="w-10 text-center font-semibold"
  style={{
    color: themeColor,
  }}
>
  {item.quantity}
</div>

            <button
              onClick={onIncrease}
              className="w-9 h-9 flex items-center justify-center transition"
              style={{
                color: themeColor,
              }}
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            onClick={onRemove}
            className="text-red-500 hover:text-red-600"
            style={{
              color: themeColor,
            }}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}