"use client";

import Link from "next/link";
import { WebsiteProduct } from "@/lib/product";

type Props = {
  product: WebsiteProduct;
};

export default function ProductCard({
  product,
}: Props) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8E1CE] bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

      {/* Image */}
      <div className="relative overflow-hidden bg-[#F8F5EE]">

        <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">

          {product.new_arrival && (
            <span className="rounded-full bg-[#98691D] px-3 py-1 text-xs font-semibold text-white">
              NEW
            </span>
          )}

          {product.discount_percentage > 0 && (
            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
              -{product.discount_percentage}%
            </span>
          )}

        </div>

        <button className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow transition hover:bg-[#98691D] hover:text-white">
          ♡
        </button>

        <Link href={`/product/${product.slug}`}>

          <div className="relative h-[260px] sm:h-[320px] lg:h-[420px] w-full overflow-hidden bg-[#F8F5EE]">

            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl">👕</div>
                  <p className="mt-2 text-sm text-gray-400">
                    No Image
                  </p>
                </div>
              </div>
            )}

          </div>

        </Link>

      </div>

      {/* Content */}

      <div className="flex flex-1 flex-col p-4 lg:p-5">

        <div className="mb-2 text-xs text-yellow-500">
          ★★★★★
          <span className="ml-2 text-gray-500">
            (24 Reviews)
          </span>
        </div>

        <Link href={`/product/${product.slug}`}>

          <h3 className="line-clamp-2 text-sm font-semibold text-[#2B2B2B] hover:text-[#98691D] sm:text-lg">
            {product.name}
          </h3>

        </Link>

        <div className="mt-3 flex items-center gap-2">

          <span className="text-xl font-bold text-[#98691D] sm:text-2xl">
            ৳{product.sale_price ?? product.price}
          </span>

          {product.sale_price && (
            <span className="text-sm text-gray-400 line-through">
              ৳{product.price}
            </span>
          )}

        </div>

        <button className="mt-auto w-full rounded-xl bg-[#98691D] py-3 text-sm font-semibold text-white transition hover:bg-[#B48630]">
          Add To Cart
        </button>

      </div>

    </div>
  );
}