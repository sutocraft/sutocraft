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

  const {
    themeColor,
  } = useTheme();

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
          min-w-0
          cursor-pointer
          flex-col
          overflow-hidden
          rounded-3xl
          border
          shadow-sm
          transition-all
          duration-300

          hover:-translate-y-1
          hover:shadow-2xl
        "
        style={{
          borderColor: cardBorder,
          background: cardBackground,
        }}
      >

        {/* =====================================================
            IMAGE
           ===================================================== */}

        <div
          className="
            relative
            min-w-0
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

              sm:right-3
              sm:top-3
              sm:gap-2
            "
          >
            {product.new_arrival && (
              <span
                className="
                  whitespace-nowrap
                  rounded-full
                  px-2
                  py-0.5
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-wide
                  text-white
                  shadow-md

                  sm:px-2.5
                  sm:py-1
                  sm:text-[10px]
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
                  whitespace-nowrap
                  rounded-full
                  px-2
                  py-0.5
                  text-[8px]
                  font-bold
                  text-white
                  shadow-md

                  sm:px-2.5
                  sm:py-1
                  sm:text-[10px]
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
            onClick={(e) =>
              e.stopPropagation()
            }
            className="
              absolute
              bottom-2
              right-2
              z-20

              sm:bottom-3
              sm:right-3
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
              min-w-0
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
                  transition-all
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


        {/* =====================================================
            CONTENT
           ===================================================== */}

        <div
          className="
            flex
            min-w-0
            flex-1
            flex-col

            p-2

            sm:p-3

            lg:p-4
          "
        >

          {/* ===================================================
              RATING
             =================================================== */}

          <div
            className="
              mb-1.5
              flex
              min-w-0
              items-center
              gap-1.5

              sm:mb-2
              sm:gap-2
            "
          >
            <span
              className="
                shrink-0
                text-[10px]

                sm:text-xs
              "
              style={{
                color: themeColor,
              }}
            >
              ★★★★★
            </span>

            <span
              className="
                shrink-0
                text-[9px]
                font-medium

                sm:text-[11px]
              "
              style={{
                color: textColor,
              }}
            >
              4.9
            </span>
          </div>


          {/* ===================================================
              PRODUCT NAME
             =================================================== */}

          <div
            className="
              min-w-0
              min-h-[40px]

              sm:min-h-[48px]
            "
          >
            <h3
              className="
                line-clamp-2
                break-words
                font-semibold
                leading-[1.2]
                text-[11px]

                sm:text-[13px]

                lg:text-[15px]
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
                  min-w-0
                  truncate
                  text-[8px]
                  uppercase
                  tracking-[0.05em]

                  sm:text-[10px]
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


          {/* ===================================================
              PRICE
             =================================================== */}

          <div
            className="
              mt-2
              flex
              min-w-0
              items-baseline
              gap-1.5
              overflow-hidden

              sm:mt-3
              sm:gap-2
            "
          >
            <span
              className="
                min-w-0
                truncate
                whitespace-nowrap
                font-extrabold
                text-[clamp(0.9rem,1.45vw,1.5rem)]
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
                  min-w-0
                  truncate
                  whitespace-nowrap
                  pb-0.5
                  text-[9px]
                  line-through

                  sm:text-[11px]
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


          {/* ===================================================
              DIVIDER
             =================================================== */}

          <div className="mt-auto pt-3 sm:pt-4">
            <div
              className="border-t"
              style={{
                borderColor: cardBorder,
              }}
            />
          </div>


          {/* ===================================================
              FOOTER / VIEW DETAILS
             =================================================== */}

          <div className="pt-2.5 sm:pt-3">

            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
              className="
                group/button
                flex
                min-w-0
                h-9
                w-full
                items-center
                justify-between
                gap-1
                overflow-hidden
                rounded-xl
                border
                px-2

                transition-all
                duration-300

                hover:shadow-lg

                sm:h-10
                sm:rounded-2xl
                sm:px-3
              "
              style={{
                borderColor: themeColor,
              }}
            >

              {/* Text */}
              <span
                className="
                  min-w-0
                  flex-1
                  truncate
                  whitespace-nowrap
                  text-left
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.04em]

                  sm:text-[10px]
                  sm:tracking-[0.06em]

                  lg:text-[11px]
                "
                style={{
                  color: themeColor,
                }}
              >
                View Details
              </span>


              {/* Arrow */}
              <span
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-sm
                  leading-none
                  text-white

                  transition-all
                  duration-300

                  group-hover/button:translate-x-0.5
                  group-hover/button:scale-105

                  sm:h-8
                  sm:w-8
                  sm:text-base
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
              </span>

            </button>

          </div>

        </div>
      </article>


      {/* =======================================================
          PRODUCT DETAILS MODAL
         ======================================================= */}

      <ProductDetailsModal
  open={open}
  slug={product.slug}
  onClose={() => setOpen(false)}
  useHistory={false}
/>
    </>
  );
}