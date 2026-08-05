"use client";

import Image from "next/image";

type Props = {
  item: any;
  reload: () => void;
};

export default function CartDrawerItem({
  item,
}: Props) {
  const image =
    item.product?.image ||
    "/images/no-image.png";

  const name =
    item.product?.name ||
    "Product";

  const price =
    item.product?.price || 0;

  const quantity =
    item.quantity || 1;

  const size =
    item.size?.name;

  const color =
    item.color?.name;

  return (
    <div className="mb-5 border-b pb-5">

      <div className="flex gap-4">

        <div className="relative h-24 w-24 overflow-hidden rounded-lg border">

          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />

        </div>

        <div className="flex flex-1 flex-col">

          <h3 className="text-base font-semibold text-gray-800">
            {name}
          </h3>

          {size && (
            <p className="mt-1 text-sm text-gray-500">
              Size : {size}
            </p>
          )}

          {color && (
            <p className="text-sm text-gray-500">
              Color : {color}
            </p>
          )}

          <p className="mt-2 text-sm text-gray-600">
            Qty : {quantity}
          </p>

          <div className="mt-auto">

            <p className="text-lg font-bold text-[#98691D]">
              ৳ {price}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}