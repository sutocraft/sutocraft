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

        <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">

          {product.new_arrival && (
            <span className="rounded-full bg-[#98691D] px-3 py-1 text-[11px] font-bold tracking-wide text-white shadow-sm">
              NEW
            </span>
          )}

          {product.discount_percentage > 0 && (
            <span className="rounded-full bg-[#E11D48] px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              -{product.discount_percentage}%
            </span>
          )}

        </div>

        <div className="absolute right-3 top-3 z-10">
  <WishlistButton productId={product.id} />
</div>

        

          <div className="relative h-[250px] w-full overflow-hidden bg-[#F8F5EE] sm:h-[320px] lg:h-[430px]">

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

        

      </div>

      {/* Content */}

      <div className="flex flex-1 flex-col p-4 sm:p-5">

        <div className="mb-2 flex items-center gap-2 text-[11px] sm:text-xs">
  <span className="text-yellow-500">★★★★★</span>
  <span className="font-medium text-gray-500">4.9</span>
</div>

        

          <h3 className="line-clamp-2 min-h-[42px] text-[15px] font-semibold leading-5 text-[#2B2B2B] transition sm:text-lg">
            {product.name}
          </h3>

       

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
  <div className="flex items-center justify-between border-t border-[#EFE8DA] pt-3">
    <span className="text-sm font-medium text-gray-500 transition group-hover:text-[#98691D]">
      View Details
    </span>

    <span className="text-xl font-semibold text-[#98691D] transition-transform duration-300 group-hover:translate-x-1">
      →
    </span>
  </div>
</div>
      </div>

    </Link>
  );
}