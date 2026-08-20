"use client";

import { useEffect, useState } from "react";
import {
  getAllProducts,
  WebsiteProduct,
} from "@/lib/products";
import { useTheme } from "./settings.theme_color";

type Props = {
  currentProduct: WebsiteProduct;
};

export default function RelatedProducts({
  currentProduct,
}: Props) {
  const { themeColor } = useTheme();

  const [products, setProducts] = useState<
    WebsiteProduct[]
  >([]);

  useEffect(() => {
    let active = true;

    async function loadRelatedProducts() {
      try {
        const allProducts = await getAllProducts();

        const currentCategoryId =
          currentProduct.category_id || "";

        const currentSubCategoryId =
          currentProduct.sub_category_id || "";

        const currentSku = String(
          currentProduct.sku || ""
        ).trim();

        /*
         * =====================================================
         * STEP 1
         * Remove:
         * - null products
         * - current product
         * - out of stock products
         * - duplicate SKU
         * =====================================================
         */

        const seenSkus = new Set<string>();

        const available = allProducts.filter(
          (item) => {
            if (!item) {
              return false;
            }

            const itemSku = String(
              item.sku || ""
            ).trim();

            // Remove current product by SKU
            if (
              itemSku &&
              currentSku &&
              itemSku === currentSku
            ) {
              return false;
            }

            // Only show products with stock
            if (
              Number(item.stock || 0) <= 0
            ) {
              return false;
            }

            // Remove duplicate SKU
            if (itemSku) {
              if (seenSkus.has(itemSku)) {
                return false;
              }

              seenSkus.add(itemSku);
            }

            return true;
          }
        );

        /*
         * =====================================================
         * STEP 2
         * Priority 1:
         * Same sub-category
         * =====================================================
         */

        const sameSubCategory =
          currentSubCategoryId
            ? available.filter(
                (item) =>
                  item.sub_category_id ===
                  currentSubCategoryId
              )
            : [];

        /*
         * =====================================================
         * STEP 3
         * Priority 2:
         * Same category
         *
         * Exclude products already belonging to
         * the same sub-category group.
         * =====================================================
         */

        const sameCategory =
          currentCategoryId
            ? available.filter(
                (item) =>
                  item.category_id ===
                    currentCategoryId &&
                  item.sub_category_id !==
                    currentSubCategoryId
              )
            : [];

        /*
         * =====================================================
         * STEP 4
         * Priority 3:
         * Fallback products
         *
         * Used only when same category/sub-category
         * products are not enough.
         * =====================================================
         */

        const usedIds = new Set(
          [
            ...sameSubCategory,
            ...sameCategory,
          ].map((item) => item.id)
        );

        const fallbackProducts =
          available.filter(
            (item) => !usedIds.has(item.id)
          );

        /*
         * =====================================================
         * STEP 5
         * Final maximum = 4
         *
         * Priority:
         * 1. Same sub-category
         * 2. Same category
         * 3. Other products
         * =====================================================
         */

        const related = [
          ...sameSubCategory,
          ...sameCategory,
          ...fallbackProducts,
        ].slice(0, 4);

        if (active) {
          setProducts(related);
        }
      } catch (error) {
        console.error(
          "Failed to load related products:",
          error
        );

        if (active) {
          setProducts([]);
        }
      }
    }

    loadRelatedProducts();

    return () => {
      active = false;
    };
  }, [
    currentProduct.id,
    currentProduct.sku,
    currentProduct.category_id,
    currentProduct.sub_category_id,
  ]);

  /*
   * =========================================================
   * No related products
   * =========================================================
   */

  if (!products.length) {
    return null;
  }

  /*
   * =========================================================
   * Open product inside existing ProductDetailsModal
   * =========================================================
   */

  function openRelatedProduct(
    slug: string
  ) {
    if (!slug) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent(
        "product-modal-change",
        {
          detail: {
            slug,
          },
        }
      )
    );
  }

  return (
    <section
      className="
        mt-0
        flex
        w-full
        min-w-0
        flex-col
        self-stretch
        lg:h-full
      "
    >
      {/* =====================================================
          HEADER
         ===================================================== */}

      <div
        className="
          mb-4
          shrink-0
        "
      >
        <p
          className="
            text-[9px]
            font-bold
            uppercase
            tracking-[0.25em]
          "
          style={{
            color: themeColor,
          }}
        >
          You May Also Like
        </p>

        <h2
          className="
            mt-1
            text-lg
            font-bold
            text-[#183153]
            sm:text-xl
          "
        >
          Related Products
        </h2>
      </div>

      {/* =====================================================
          PRODUCTS GRID

          Mobile  : 2 columns
          Desktop : 2 columns
          Maximum : 4 products
         ===================================================== */}

      <div
        className="
          grid
          w-full
          min-w-0
          grid-cols-2
          gap-3
          lg:flex-1
          lg:auto-rows-fr
        "
      >
        {products.map((item) => {
          const price =
            item.sale_price ??
            item.price;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                openRelatedProduct(
                  item.slug
                )
              }
              className="
                group
                flex
                h-full
                w-full
                min-w-0
                flex-col
                overflow-hidden
                rounded-xl
                border
                bg-white
                text-left
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-lg
              "
              style={{
                borderColor:
                  "var(--theme-primary-border)",
              }}
            >
              {/* =================================================
                  IMAGE
                 ================================================= */}

              <div
                className="
                  relative
                  aspect-[4/5]
                  w-full
                  shrink-0
                  overflow-hidden
                  bg-white
                "
              >
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="
                      h-full
                      w-full
                      object-contain
                      p-2
                      transition-transform
                      duration-300
                      group-hover:scale-105
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-full
                      items-center
                      justify-center
                      text-3xl
                    "
                  >
                    👕
                  </div>
                )}

                {/* =================================================
                    DISCOUNT BADGE
                   ================================================= */}

                {Number(
                  item.discount_percentage || 0
                ) > 0 && (
                  <span
                    className="
                      absolute
                      right-2
                      top-2
                      rounded-full
                      px-2
                      py-1
                      text-[8px]
                      font-bold
                      text-white
                    "
                    style={{
                      backgroundColor:
                        themeColor,
                    }}
                  >
                    -
                    {
                      item.discount_percentage
                    }
                    %
                  </span>
                )}
              </div>

              {/* =================================================
                  PRODUCT INFORMATION
                 ================================================= */}

              <div
                className="
                  flex
                  min-h-0
                  flex-1
                  flex-col
                  p-3
                "
              >
                {/* Product Name */}

                <h3
                  className="
                    line-clamp-2
                    min-h-[34px]
                    text-xs
                    font-semibold
                    leading-tight
                    text-[#183153]
                    sm:text-sm
                  "
                >
                  {item.name}
                </h3>

                {/* Category */}

                {(item.category?.name ||
                  item.sub_category?.name) && (
                  <p
                    className="
                      mt-1
                      truncate
                      text-[8px]
                      uppercase
                      tracking-wide
                      text-gray-500
                    "
                  >
                    {item.category?.name}

                    {item.category?.name &&
                      item.sub_category?.name &&
                      " • "}

                    {item.sub_category?.name}
                  </p>
                )}

                {/* SKU */}

                {item.sku && (
                  <p
                    className="
                      mt-1
                      truncate
                      text-[8px]
                      text-gray-400
                    "
                  >
                    SKU: {item.sku}
                  </p>
                )}

                {/* =================================================
                    PRICE
                   ================================================= */}

                <div
                  className="
                    mt-auto
                    flex
                    min-w-0
                    items-baseline
                    gap-2
                    overflow-hidden
                    pt-2
                  "
                >
                  <span
                    className="
                      min-w-0
                      truncate
                      whitespace-nowrap
                      text-sm
                      font-extrabold
                      sm:text-base
                    "
                    style={{
                      color: themeColor,
                    }}
                  >
                    ৳{price}
                  </span>

                  {item.sale_price && (
                    <span
                      className="
                        min-w-0
                        truncate
                        whitespace-nowrap
                        text-[9px]
                        text-gray-400
                        line-through
                      "
                    >
                      ৳{item.price}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}