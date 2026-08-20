"use client";

import { useEffect, useMemo, useState } from "react";

import { WebsiteProduct } from "@/lib/products";

import {
  useTheme,
} from "@/app/components/website/settings.theme_color";

import WishlistButton from "./WishlistButton";
import ProductDetailsModal from "./ProductDetailsModal";
import { getProductReviewSummary } from "@/lib/reviews";

type Props = {
  product: WebsiteProduct;
};

export default function ProductCard({
  product,
}: Props) {
  const [open, setOpen] = useState(false);
  const [reviewSummary, setReviewSummary] = useState({
    average: 0,
    count: 0,
  });

  useEffect(() => {
    let active = true;

    const loadReviewSummary = async () => {
      try {
        const summary = await getProductReviewSummary(product.sku || "");
        if (active) {
          setReviewSummary(summary);
        }
      } catch (error) {
        console.error("Failed to load product review summary:", error);
      }
    };

    loadReviewSummary();

    const handleReviewUpdate = () => {
      loadReviewSummary();
    };

    window.addEventListener("product-reviews-updated", handleReviewUpdate);

    return () => {
      active = false;
      window.removeEventListener(
        "product-reviews-updated",
        handleReviewUpdate
      );
    };
  }, [product.sku]);

  const {
    themeColor,
  } = useTheme();

  const hoverColor = themeColor;

const cardBorder =
  "var(--theme-primary-border)";

const cardBackground =
  "var(--theme-background)";

const imageBackground =
  "#FFFFFF";

const titleColor =
  "#2B2B2B";

const textColor =
  "#1b1c1f";

const badgeColor =
  themeColor;

const dangerColor =
  "#FF214F";

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


        {/* REVIEW SUMMARY */}
        <div className="px-2 pt-2 sm:px-3 sm:pt-3 lg:px-4">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm">
            <span style={{ color: themeColor }}>
              ★★★★★
            </span>
            <span
              className="font-medium"
              style={{ color: textColor }}
            >
              {reviewSummary.count > 0
                ? reviewSummary.average.toFixed(1)
                : "0.0"}
            </span>
            <span
              className="text-[10px] sm:text-xs"
              style={{ color: textColor }}
            >
              ({reviewSummary.count})
            </span>
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
              mt-1
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