"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

type Props = {
  item: any;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export default function CartDrawerItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) {
  const product = item.products;

  const image =
    product?.product_images?.find(
      (img: any) => img.is_primary
    )?.image_url ||
    product?.product_images?.[0]?.image_url ||
    "/no-image.png";

  const price =
    product?.discount_price ??
    product?.price ??
    0;

  return (
    <div className="border-b p-5">

      <div className="flex gap-4">

        {/* Image */}

        <div className="relative h-24 w-24 overflow-hidden rounded-xl border bg-gray-100">

          <Image
            src={image}
            alt={product?.name || "Product"}
            fill
            className="object-cover"
          />

        </div>

        {/* Details */}

        <div className="flex flex-1 flex-col">

          <h3 className="line-clamp-2 text-base font-semibold text-[#1F2937]">

            {product?.name}

          </h3>

          {item.sizes && (

            <p className="mt-2 text-sm text-gray-500">

              Size :
              <span className="ml-1 font-medium text-[#1F2937]">

                {item.sizes.name}

              </span>

            </p>

          )}

          {item.colors && (

            <p className="text-sm text-gray-500">

              Color :
              <span className="ml-1 font-medium text-[#1F2937]">

                {item.colors.name}

              </span>

            </p>

          )}

          <div className="mt-3 flex items-center justify-between">

            <span className="text-lg font-bold text-[#B6862C]">

              ৳{price.toLocaleString()}

            </span>

            <button
              onClick={onRemove}
              className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
            >

              <Trash2 size={18} />

            </button>

          </div>

          {/* Quantity */}

          <div className="mt-4 flex items-center gap-2">

            <button
              onClick={onDecrease}
              className="flex h-9 w-9 items-center justify-center rounded-lg border transition hover:bg-gray-100"
            >

              <Minus size={16} />

            </button>

            <div className="flex h-9 min-w-[42px] items-center justify-center rounded-lg border font-semibold">

              {item.quantity}

            </div>

            <button
              onClick={onIncrease}
              className="flex h-9 w-9 items-center justify-center rounded-lg border transition hover:bg-gray-100"
            >

              <Plus size={16} />

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}