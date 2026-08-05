"use client";

type Props = {
  item: any;
};

export default function CartDrawerItem({
  item,
}: Props) {
  return (
    <div className="flex gap-4 py-4 border-b">

      <div className="w-20 h-20 rounded bg-gray-100 flex items-center justify-center">
        IMG
      </div>

      <div className="flex-1">

        <h3 className="font-semibold">
          {item?.name ?? "Product"}
        </h3>

        <p className="text-sm text-gray-500">
          Qty : {item?.quantity ?? 1}
        </p>

        <p className="font-bold mt-2">
          ৳ {item?.price ?? 0}
        </p>

      </div>

    </div>
  );
}