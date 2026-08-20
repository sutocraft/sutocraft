"use client";

import { useEffect, useState } from "react";
import { getAllProducts, WebsiteProduct } from "@/lib/products";
import { useTheme } from "./settings.theme_color";
import ProductDetailsModal from "./ProductDetailsModal";

type Props = {
  currentProduct: WebsiteProduct;
};

export default function RelatedProducts({
  currentProduct,
}: Props) {
  const { themeColor } = useTheme();

  const [products, setProducts] = useState<WebsiteProduct[]>([]);
  const [openSlug, setOpenSlug] = useState("");

  useEffect(() => {
    let active = true;

    async function loadRelatedProducts() {
      try {
        const allProducts = await getAllProducts();

        const currentCategoryId =
          currentProduct.category?.id || "";

        const currentSubCategoryId =
          currentProduct.sub_category?.id || "";

        const currentSku =
          String(currentProduct.sku || "").trim();

        const available = allProducts.filter((item) => {
          if (!item || item.sku === currentSku) {
            return false;
          }

          if (Number(item.stock || 0) <= 0) {
            return false;
          }

          return true;
        });

        /*
         * Priority:
         * 1. Same sub-category
         * 2. Same category
         */
        const sameSubCategory = available.filter(
          (item) =>
            currentSubCategoryId &&
            item.sub_category?.id === currentSubCategoryId
        );

        const sameCategory = available.filter(
          (item) =>
            currentCategoryId &&
            item.category?.id === currentCategoryId &&
            item.sub_category?.id !== currentSubCategoryId
        );

        const related = [
          ...sameSubCategory,
          ...sameCategory,
        ].slice(0, 6);

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
    currentProduct.category?.id,
    currentProduct.sub_category?.id,
  ]);

  if (!products.length) {
    return null;
  }

  return (
    <>
      <section className="mt-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.25em]"
              style={{ color: themeColor }}
            >
              You May Also Like
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#183153] sm:text-2xl">
              Related Products
            </h2>
          </div>
        </div>

        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:grid-cols-3
            lg:grid-cols-4
          "
        >
          {products.map((item) => {
            const price =
              item.sale_price ?? item.price;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setOpenSlug(item.slug)}
                className="
                  group
                  overflow-hidden
                  rounded-2xl
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
                <div className="relative aspect-[4/5] overflow-hidden bg-white">
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
                    <div className="flex h-full items-center justify-center text-4xl">
                      👕
                    </div>
                  )}

                  {item.discount_percentage > 0 && (
                    <span
                      className="
                        absolute
                        right-2
                        top-2
                        rounded-full
                        px-2
                        py-1
                        text-[9px]
                        font-bold
                        text-white
                      "
                      style={{
                        backgroundColor: "#FF214F",
                      }}
                    >
                      -{item.discount_percentage}%
                    </span>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="line-clamp-2 min-h-[38px] text-sm font-semibold leading-tight text-[#183153]">
                    {item.name}
                  </h3>

                  {(item.category?.name ||
                    item.sub_category?.name) && (
                    <p className="mt-1 truncate text-[9px] uppercase tracking-wide text-gray-500">
                      {item.category?.name}

                      {item.category?.name &&
                        item.sub_category?.name &&
                        " • "}

                      {item.sub_category?.name}
                    </p>
                  )}

                  <div className="mt-2 flex items-baseline gap-2">
                    <span
                      className="text-base font-extrabold"
                      style={{ color: themeColor }}
                    >
                      ৳{price}
                    </span>

                    {item.sale_price && (
                      <span className="text-[10px] text-gray-400 line-through">
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

      {openSlug && (
        <ProductDetailsModal
          open={true}
          slug={openSlug}
          onClose={() => setOpenSlug("")}
          useHistory={false}
        />
      )}
    </>
  );
}