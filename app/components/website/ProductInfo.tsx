"use client";

import { Star, ShieldCheck, Truck, PackageCheck } from "lucide-react";

import type { WebsiteProduct } from "@/lib/products";



type Size = {
  id: string;
  name: string;
};

type Color = {
  id: string;
  name: string;
  code?: string;
};



type Props = {
  product: WebsiteProduct;

  selectedSize: string;
  selectedColor: string;

  quantity: number;

  onIncrease: () => void;
  onDecrease: () => void;

  sizes: Size[];
  colors: Color[];

  onSizeChange: (id: string) => void;
  onColorChange: (id: string) => void;

  onAddToCart: () => void;
  onBuyNow: () => void;
};

export default function ProductInfo({
  product,

  selectedSize,
  selectedColor,

  quantity,

  onIncrease,
  onDecrease,

  sizes,
  colors,

  onSizeChange,
  onColorChange,

  onAddToCart,
  onBuyNow,
}: Props) {

  const price =
    product.sale_price ?? product.price;

  const oldPrice =
    product.sale_price
      ? product.price
      : null;

  const inStock =
    product.stock > 0;

  return (
    <div className="flex h-full flex-col">

      <div className="space-y-4">

        <div className="flex flex-wrap items-center gap-2">

          {product.discount_percentage ? (
            <span className="rounded-full bg-[#FF214F] px-3 py-1 text-xs font-bold text-white">
              -{product.discount_percentage}%
            </span>
          ) : null}

          {inStock ? (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              In Stock
            </span>
          ) : (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
              Out Of Stock
            </span>
          )}

        </div>

        <h1 className="text-3xl font-bold leading-tight text-[#2B2B2B] lg:text-4xl">
          {product.name}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">

          <div className="flex items-center gap-1">

            <Star
              size={16}
              className="fill-yellow-400 text-yellow-400"
            />

            <span className="font-semibold">
              4.9
            </span>

            <span>(128 Reviews)</span>

          </div>

          {product.sku && (
            <span>
              SKU :
              <span className="ml-1 font-semibold text-[#2B2B2B]">
                {product.sku}
              </span>
            </span>
          )}

        </div>

        {(product.category ||
          product.sub_category) && (

          <div className="flex flex-wrap gap-2">

            {product.category && (
              <span className="rounded-full bg-[#F8F5EE] px-3 py-1 text-xs font-semibold text-[#98691D]">
                {product.category.name}
              </span>
            )}

            {product.sub_category && (
              <span className="rounded-full bg-[#F8F5EE] px-3 py-1 text-xs font-semibold text-[#98691D]">
                {product.sub_category.name}
              </span>
            )}

          </div>
        )}

        <div className="flex items-end gap-3">

          <span className="text-4xl font-extrabold text-[#98691D]">
            ৳{price}
          </span>

          {oldPrice && (
            <span className="pb-1 text-lg text-gray-400 line-through">
              ৳{oldPrice}
            </span>
          )}

        </div>

        {product.short_description && (
          <p className="leading-7 text-gray-600">
            {product.short_description}
          </p>
        )}

      </div>

            {/* Features */}

      <div className="mt-8 grid grid-cols-3 gap-3">

        <div className="rounded-2xl border border-[#E8E1CE] bg-[#FDFBF7] p-4 text-center">

          <Truck
            size={22}
            className="mx-auto mb-2 text-[#98691D]"
          />

          <p className="text-xs font-semibold text-[#2B2B2B]">
            Fast Delivery
          </p>

        </div>

        <div className="rounded-2xl border border-[#E8E1CE] bg-[#FDFBF7] p-4 text-center">

          <ShieldCheck
            size={22}
            className="mx-auto mb-2 text-[#98691D]"
          />

          <p className="text-xs font-semibold text-[#2B2B2B]">
            Quality Guaranteed
          </p>

        </div>

        <div className="rounded-2xl border border-[#E8E1CE] bg-[#FDFBF7] p-4 text-center">

          <PackageCheck
            size={22}
            className="mx-auto mb-2 text-[#98691D]"
          />

          <p className="text-xs font-semibold text-[#2B2B2B]">
            Easy Return
          </p>

        </div>

      </div>

      {/* Size */}

      {sizes.length > 0 && (

        <div className="mt-8">

          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider !text-[#2B2B2B]">
            Select Size
          </h3>

          <div className="flex flex-wrap gap-3">

            {sizes.map((size) => (

              <button
                key={size.id}
                onClick={() =>
                  onSizeChange(size.id)
                }
                className={`min-w-[52px] rounded-xl border px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                  selectedSize === size.id
                    ? "border-[#98691D] bg-[#98691D] text-white shadow-lg"
                    : "border-[#E8E1CE] bg-white text-[#2B2B2B] hover:border-[#98691D]"
                }`}
              >
                {size.name}
              </button>

            ))}

          </div>

        </div>

      )}

      {/* Color */}

{colors.length > 0 && (
  <div className="mt-8">

    <h3 className="mb-4 text-[13px] font-bold uppercase tracking-[0.15em] text-[#2B2B2B]">
      Select Color
    </h3>

    <div className="flex flex-wrap gap-3">

      {colors.map((color) => {
        const active = selectedColor === color.id;

        return (
          <button
            key={color.id}
            onClick={() => onColorChange(color.id)}
            className={`group flex min-w-[105px] items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-300 ${
              active
                ? "border-[#98691D] bg-[#98691D] text-white shadow-lg shadow-[#98691D]/25"
                : "border-[#E8E1CE] bg-white text-[#2B2B2B] hover:border-[#98691D] hover:shadow-md"
            }`}
          >
            <span
              className={`h-5 w-5 rounded-full border-2 ${
                active
                  ? "border-white"
                  : "border-gray-300"
              }`}
              style={{
                backgroundColor:
                  color.code || "#98691D",
              }}
            />

            <span
              className={`text-sm font-semibold ${
                active
                  ? "text-white"
                  : "text-[#2B2B2B]"
              }`}
            >
              {color.name}
            </span>

          </button>
        );
      })}

    </div>

  </div>
)}

{/* Quantity */}

<div className="mt-8">

  <h3 className="mb-4 text-[13px] font-bold uppercase tracking-[0.15em] text-[#2B2B2B]">
    Quantity
  </h3>

  <div className="flex items-center justify-between gap-5 flex-wrap">

    <div className="flex items-center overflow-hidden rounded-2xl border border-[#D9C8A6] bg-white shadow-sm">

      <button
        onClick={onDecrease}
        className="flex h-12 w-12 items-center justify-center text-2xl font-bold text-[#2B2B2B] transition hover:bg-[#98691D] hover:text-white"
      >
        −
      </button>

      <div className="flex h-12 min-w-[64px] items-center justify-center border-x border-[#D9C8A6] bg-[#FCFAF6] text-lg font-bold text-[#2B2B2B]">
        {quantity}
      </div>

      <button
        onClick={onIncrease}
        className="flex h-12 w-12 items-center justify-center text-2xl font-bold text-[#2B2B2B] transition hover:bg-[#98691D] hover:text-white"
      >
        +
      </button>

    </div>

    <div className="rounded-xl bg-[#F8F5EE] px-4 py-2">

      <span className="text-sm font-medium text-[#666]">
        Available
      </span>

      <span className="ml-2 text-base font-bold text-[#2B2B2B]">
        {product.stock}
      </span>

    </div>

  </div>

</div>

{/* Action Buttons */}

<div className="mt-10 grid gap-4">

  <button
    onClick={onAddToCart}
    disabled={!inStock}
    className="flex h-14 items-center justify-center rounded-2xl bg-[#98691D] text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#7A5318] hover:shadow-xl disabled:cursor-not-allowed disabled:bg-gray-300"
  >
    Add To Cart
  </button>

  <button
    onClick={onBuyNow}
    disabled={!inStock}
    className="flex h-14 items-center justify-center rounded-2xl border-2 border-[#98691D] bg-white text-base font-bold text-[#98691D] transition-all duration-300 hover:bg-[#98691D] hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-300"
  >
    Buy Now
  </button>

</div>

      {/* Extra Info */}

      <div className="mt-10 rounded-3xl border border-[#E8E1CE] bg-[#FDFBF7] p-6">

        <div className="flex items-center justify-between border-b border-[#ECE4D2] pb-3">

          <span className="font-medium text-gray-500">
            Brand
          </span>

          <span className="font-semibold text-[#2B2B2B]">
            {product.brand?.name ?? "SutoCraft"}
          </span>

        </div>

        <div className="mt-3 flex items-center justify-between border-b border-[#ECE4D2] pb-3">

          <span className="font-medium text-gray-500">
            Category
          </span>

          <span className="font-semibold text-[#2B2B2B]">
            {product.category?.name ?? "-"}
          </span>

        </div>

        <div className="mt-3 flex items-center justify-between">

          <span className="font-medium text-gray-500">
            Availability
          </span>

          <span
            className={`font-semibold ${
              inStock
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {inStock
              ? "In Stock"
              : "Out Of Stock"}
          </span>

        </div>

      </div>
    </div>
  );
}