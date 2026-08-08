"use client";

import { useMemo, useState } from "react";

import { WebsiteProduct } from "@/lib/products";

import {
  useTheme,
} from "@/app/components/website/settings.theme_color";

import WishlistButton from "./WishlistButton";
import ProductDetailsModal from "./ProductDetailsModal";

type Props = {
  product: WebsiteProduct;
};

export default function ProductCard({
  product,
}: Props) {
  const [open, setOpen] = useState(false);

  const { themeColor } = useTheme();

  const hoverColor = themeColor;

  const cardBorder = "#E8E1CE";
  const cardBackground = "#FFFFFF";
  const imageBackground = "#F8F5EE";
  const titleColor = "#2B2B2B";
  const textColor = "#6B7280";
  const badgeColor = themeColor;
  const dangerColor = "#FF214F";

  const imagePadding = useMemo(() => {
    return product.category?.name === "Woman"
      ? "p-0"
      : "p-2";
  }, [product.category?.name]);

  return (
    <>
      <article
        onClick={() => setOpen(true)}
        className="
          group
          flex
          h-full
          min-h-0
          cursor-pointer
          flex-col
          overflow-hidden
          rounded-2xl
          border
          shadow-sm
          transition-all
          duration-300

          hover:-translate-y-1
          hover:shadow-xl

          sm:rounded-3xl
        "
        style={{
          borderColor: cardBorder,
          background: cardBackground,
        }}
      >
        {/* IMAGE */}
        <div
          className="
            relative
            overflow-hidden
          "
          style={{
            background: imageBackground,
          }}
        >
          {/* BADGES */}
          <div
            className="
              absolute
              right-2
              top-2
              z-20

              flex
              flex-col
              items-end
              gap-1.5

              sm:right-4
              sm:top-4
              sm:gap-2
            "
          >
            {product.new_arrival && (
              <span
                className="
                  rounded-full
                  px-2.5
                  py-1
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.08em]
                  text-white
                  shadow-lg

                  sm:px-3
                  sm:text-[11px]
                "
                style={{
                  background: badgeColor,
                }}
              >
                NEW
              </span>
            )}

            {product.discount_percentage > 0 && (
              <span
                className="
                  rounded-full
                  px-2.5
                  py-1
                  text-[9px]
                  font-bold
                  text-white
                  shadow-lg

                  sm:px-3
                  sm:text-[11px]
                "
                style={{
                  background: dangerColor,
                }}
              >
                -{product.discount_percentage}%
              </span>
            )}
          </div>

          {/* WISHLIST */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              absolute
              bottom-2
              right-2
              z-20

              sm:bottom-4
              sm:right-4
            "
          >
            <WishlistButton
              productId={product.id}
            />
          </div>

          {/* PRODUCT IMAGE */}
          <div
            className="
              relative
              aspect-[4/5]
              overflow-hidden
            "
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className={`
                  h-full
                  w-full
                  object-contain
                  transition-transform
                  duration-500
                  group-hover:scale-105
                  ${imagePadding}
                `}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl">
                    👕
                  </div>

                  <p className="mt-2 text-xs text-gray-400 sm:text-sm">
                    No Image
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div
          className="
            flex
            flex-1
            flex-col

            p-3
            sm:p-4
            lg:p-5
          "
        >
          {/* Rating */}
          <div className="mb-2 flex items-center gap-2">
            <span
              className="text-xs sm:text-sm"
              style={{
                color: themeColor,
              }}
            >
              ★★★★★
            </span>

            <span
              className="
                text-[10px]
                font-medium
                sm:text-xs
              "
              style={{
                color: textColor,
              }}
            >
              4.9
            </span>
          </div>

          {/* Product Name */}
          <div
            className="
              min-h-[42px]
              sm:min-h-[54px]
              lg:min-h-[58px]
            "
          >
            <h3
              className="
                line-clamp-2
                font-semibold
                leading-5

                text-[13px]
                sm:text-[15px]
                lg:text-base
              "
              style={{
                color: titleColor,
              }}
            >
              {product.name}
            </h3>

            {(product.category?.name ||
              product.sub_category?.name) && (
              <p
                className="
                  mt-1
                  line-clamp-1
                  text-[9px]
                  uppercase
                  tracking-[0.08em]

                  sm:text-[11px]
                "
                style={{
                  color: textColor,
                }}
              >
                {product.category?.name}

                {product.category?.name &&
                  product.sub_category?.name &&
                  " • "}

                {product.sub_category?.name}
              </p>
            )}
          </div>

          {/* PRICE */}
          <div
            className="
              mt-3
              flex
              items-end
              gap-2
            "
          >
            <span
              className="
                text-lg
                font-extrabold

                sm:text-xl
                lg:text-2xl
              "
              style={{
                color: themeColor,
              }}
            >
              ৳
              {product.sale_price ??
                product.price}
            </span>

            {product.sale_price && (
              <span
                className="
                  pb-1
                  text-xs
                  line-through
                  sm:text-sm
                "
                style={{
                  color: textColor,
                }}
              >
                ৳
                {product.price}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="mt-auto pt-4">
            <div
              className="border-t"
              style={{
                borderColor: cardBorder,
              }}
            />
          </div>

          {/* Footer */}
          <div className="pt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
              className="
                group/button
                flex
                h-10
                w-full
                items-center
                justify-between
                rounded-xl
                border
                px-3
                transition-all
                duration-300
                hover:shadow-lg

                sm:h-12
                sm:rounded-2xl
                sm:px-4
              "
              style={{
                borderColor: themeColor,
              }}
            >
              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.08em]

                  sm:text-[13px]
                "
                style={{
                  color: themeColor,
                }}
              >
                View Details
              </span>

              <div
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  text-white
                  transition-all
                  duration-300

                  group-hover/button:translate-x-1
                  group-hover/button:scale-110

                  sm:h-9
                  sm:w-9
                "
                style={{
                  background: themeColor,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    hoverColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    themeColor;
                }}
              >
                →
              </div>
            </button>
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