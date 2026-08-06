"use client";

import { useState } from "react";

import { WebsiteProduct } from "@/lib/products";

import WishlistButton from "./WishlistButton";
import ProductDetailsModal from "./ProductDetailsModal";

type Props = {
  product: WebsiteProduct;
};

export default function ProductCard({
  product,
}: Props) {
  const [open, setOpen] =
    useState(false);

  return (
    <>

      <article
        onClick={() => setOpen(true)}
        className="product-card group flex h-full min-h-[340px] cursor-pointer flex-col overflow-hidden rounded-3xl border border-[#E8E1CE] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:min-h-[440px] lg:min-h-[540px]"
      >

        {/* IMAGE */}

        <div className="relative overflow-hidden bg-[#F8F5EE]">

          {/* BADGES */}

          <div className="absolute right-4 top-4 z-20 flex flex-col items-end gap-2">

            {product.new_arrival && (
              <span className="rounded-full bg-[#98691D] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-lg">
                NEW
              </span>
            )}

            {product.discount_percentage >
              0 && (
              <span className="rounded-full bg-[#FF214F] px-3 py-1 text-[11px] font-bold text-white shadow-lg">
                -
                {
                  product.discount_percentage
                }
                %
              </span>
            )}

          </div>

          {/* WISHLIST */}

          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="absolute bottom-4 right-4 z-20"
          >

            <WishlistButton
              productId={product.id}
            />

          </div>

          {/* PRODUCT IMAGE */}

          <div className="relative aspect-[4/5] overflow-hidden">

            {product.image_url ? (

              <img
                src={product.image_url}
                alt={product.name}
                className={`h-full w-full object-contain transition-all duration-500 group-hover:scale-[1.04] ${
                  product.category?.name ===
                  "Woman"
                    ? "p-0"
                    : "p-2"
                }`}
              />

            ) : (

              <div className="flex h-full items-center justify-center">

                <div className="text-center">

                  <div className="text-5xl">
                    👕
                  </div>

                  <p className="mt-2 text-sm text-gray-400">
                    No Image
                  </p>

                </div>

              </div>

            )}

          </div>

        </div>

                {/* CONTENT */}

        <div className="flex flex-1 flex-col p-4 sm:p-5">

          {/* Rating */}

          <div className="mb-2 flex items-center gap-2">

            <span className="text-yellow-500">
              ★★★★★
            </span>

            <span className="text-sm font-medium text-gray-500">
              4.9
            </span>

          </div>

          {/* Product Name */}

          <div className="min-h-[56px]">

            <h3 className="line-clamp-2 text-[15px] font-semibold leading-6 text-[#2B2B2B]">

              {product.name}

            </h3>

            {(product.category?.name ||
              product.sub_category?.name) && (

              <p className="mt-1 line-clamp-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">

                {product.category?.name}

                {product.category?.name &&
                  product.sub_category?.name &&
                  " • "}

                {product.sub_category?.name}

              </p>

            )}

          </div>

          {/* Price */}

          <div className="mt-3 flex items-end gap-3">

            <span className="text-2xl font-extrabold text-[#98691D]">

              ৳
              {product.sale_price ??
                product.price}

            </span>

            {product.sale_price && (

              <span className="pb-1 text-sm text-gray-400 line-through">

                ৳{product.price}

              </span>

            )}

          </div>

          {/* Divider */}

          <div className="mt-auto pt-4">

            <div className="border-t border-[#ECE4D5]" />

          </div>

          {/* Footer */}

          <div className="flex items-center justify-between pt-4">

            <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#98691D] transition group-hover:text-[#7A5318]">

              View Details

            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#98691D] text-white transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[#7A5318]">

              →

            </div>

          </div>

        </div>

      </article>

            <ProductDetailsModal
        open={open}
        slug={product.slug}
        onClose={() => setOpen(false)}
      />

    </>
  );
}