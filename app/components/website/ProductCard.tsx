"use client";

import Link from "next/link";
import { WebsiteProduct } from "@/lib/products";
import WishlistButton from "@/app/components/website/WishlistButton";


type Props = {
  product: WebsiteProduct;
};

export default function ProductCard({
  product,
}: Props) {
  
  return (
    <Link
  href={`/product/${product.slug}`}
  className="product-card group flex h-full min-h-[340px] sm:min-h-[440px] lg:min-h-[540px] flex-col overflow-hidden rounded-3xl border border-[#E8E1CE] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
>

      {/* Image */}
      <div className="relative overflow-hidden bg-[#F8F5EE]">

        <div className="absolute right-4 top-4 z-20 flex flex-col items-end gap-1.5">
  {product.new_arrival && (
    <span className="rounded-full bg-[#A87316] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow">
      NEW
    </span>
  )}

  {product.discount_percentage > 0 && (
    <span className="rounded-full bg-[#FF214F] px-3 py-1 text-[11px] font-bold text-white shadow">
      -{product.discount_percentage}%
    </span>
  )}
</div>

        <div className="absolute bottom-4 right-4 z-20">
  <WishlistButton productId={product.id} />
</div>

        

          <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F8F5EE]">

            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className={`h-full w-full object-contain transition-all duration-500 group-hover:scale-[1.04] ${
  product.category?.name === "Woman"
    ? "p-0"
    : "p-2"
}`}
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

        

      </div>

      {/* Content */}

      <div className="flex flex-1 flex-col p-4 sm:p-5">

        <div className="mb-2 flex items-center gap-2 text-[11px] sm:text-xs">
  <span className="text-yellow-500">★★★★★</span>
  <span className="font-medium text-gray-500">4.9</span>
</div>

        

          <div className="min-h-[52px]">
  <h3 className="line-clamp-2 text-[15px] font-semibold leading-5 text-[#2B2B2B]">
    {product.name}
  </h3>

  {(product.category?.name || product.sub_category?.name) && (
    <p className="mt-1 line-clamp-1 text-[11px] font-medium uppercase tracking-[0.08em] text-gray-500">
      {product.category?.name}
      {product.category?.name &&
        product.sub_category?.name &&
        " • "}
      {product.sub_category?.name}
    </p>
  )}
</div>

       

        <div className="mt-2 flex items-end gap-2">

          <span className="text-2xl font-extrabold text-[#98691D]">
            ৳{product.sale_price ?? product.price}
          </span>

          {product.sale_price && (
            <span className="text-xs text-gray-400 line-through">
              ৳{product.price}
            </span>
          )}

        </div>

        <div className="mt-auto pt-2">
  <div className="flex items-center justify-between border-t border-[#F2EEE6] pt-3">
    <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#98691D] lg:transition lg:group-hover:text-[#7A5318]">
      View Details
    </span>

    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#98691D] text-white transition-all duration-300 lg:bg-[#F8F5EE] lg:text-[#98691D] lg:group-hover:bg-[#98691D] lg:group-hover:text-white">
  <span className="text-base transition-transform duration-300 lg:group-hover:translate-x-1">
    →
  </span>
</div>
  </div>
</div>
      </div>

    </Link>
  );
}