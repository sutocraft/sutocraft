"use client";

import Link from "next/link";
import { WebsiteProduct } from "@/lib/products";
import WishlistButton from "@/app/components/website/WishlistButton";
import { addToCart } from "@/lib/cart";
import { useRouter } from "next/navigation";
import { useCartFly } from "@/app/context/cart-fly-context";

type Props = {
  product: WebsiteProduct;
};

export default function ProductCard({
  product,
}: Props) {
  const router = useRouter();

const { startFly } = useCartFly();
  return (
    <div className="product-card group flex h-full min-h-[430px] flex-col overflow-hidden rounded-3xl border border-[#E8E1CE] bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl sm:min-h-[480px] lg:min-h-[620px]">

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

        <div className="absolute right-3 top-3 z-10">
  <WishlistButton productId={product.id} />
</div>

        <Link href={`/product/${product.slug}`}>

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

        </Link>

      </div>

      {/* Content */}

      <div className="flex flex-1 flex-col p-4 sm:p-5">

        <div className="mb-3 text-[11px] text-yellow-500 sm:text-xs">
          ★★★★★
          <span className="ml-2 text-gray-500">
            (24 Reviews)
          </span>
        </div>

        <Link href={`/product/${product.slug}`}>

          <h3 className="line-clamp-2 min-h-[48px] text-base font-semibold leading-6 text-[#2B2B2B] transition sm:text-lg">
            {product.name}
          </h3>

        </Link>

        <div className="mt-3 flex items-center gap-2 min-h-[40px]">

          <span className="text-xl font-bold text-[#98691D] sm:text-2xl">
            ৳{product.sale_price ?? product.price}
          </span>

          {product.sale_price && (
            <span className="text-sm text-gray-400 line-through">
              ৳{product.price}
            </span>
          )}

        </div>

        <button
  onClick={async (e) => {
    console.count("ADD TO CART CLICK");
    const card =
      e.currentTarget.closest(".product-card");

    const image =
      card?.querySelector("img");

    if (image) {
      const rect =
        image.getBoundingClientRect();

      startFly({
        image: product.image_url ?? "",
        startX:
          rect.left + rect.width / 2,
        startY:
          rect.top + rect.height / 2,
      });
    }

    await addToCart({
  productId: product.id,
  sizeId: null,
  colorId: null,
  quantity: 1,
});

    router.refresh();
  }}
  className="mt-auto w-full rounded-2xl py-3.5 text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98]"
  style={{
    backgroundColor: "#98691D",
  }}
>
  Add To Cart
</button>
      </div>

    </div>
  );
}