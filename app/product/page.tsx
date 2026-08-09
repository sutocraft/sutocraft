"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useSearchParams } from "next/navigation";

import Header from "@/app/components/website/Header";
import Footer from "@/app/components/website/Footer";
import Container from "@/app/components/website/Container";

import {
  getAllProducts,
  WebsiteProduct,
} from "@/lib/products";

import ProductsHeader from "./ProductsHeader";
import ProductsGrid from "./ProductsGrid";
import MobileFilterDrawer from "./MobileFilterDrawer";

import MobileBottomNav from "@/app/components/website/MobileBottomNav";

import ProductDetailsModal from "@/app/components/website/ProductDetailsModal";

import {
  useTheme,
} from "@/app/components/website/settings.theme_color";

type SortOption =
  | "Newest"
  | "Price: Low to High"
  | "Price: High to Low"
  | "Name: A to Z"
  | "Name: Z to A";

export default function ProductsPage() {
  const searchParams = useSearchParams();

  const {
    themeColor,
  } = useTheme();

  /* =========================================================
     PRODUCTS
     ========================================================= */

  const [products, setProducts] = useState<
    WebsiteProduct[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  /* =========================================================
     SEARCH
     ========================================================= */

  const [search, setSearch] = useState("");

  /* =========================================================
     CATEGORY / SUBCATEGORY / BRAND
     ========================================================= */

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [selectedSubcategory, setSelectedSubcategory] =
    useState("");

  const [selectedBrand, setSelectedBrand] =
    useState("");

  /* =========================================================
     PRICE
     ========================================================= */

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  /* =========================================================
     AVAILABILITY
     ========================================================= */

  const [availability, setAvailability] =
    useState<
      "all" | "in-stock" | "out-of-stock"
    >("all");

  /* =========================================================
     SORT
     ========================================================= */

  const [sort, setSort] =
    useState<SortOption>("Newest");

  /* =========================================================
     MOBILE FILTER
     ========================================================= */

  const [mobileFilterOpen, setMobileFilterOpen] =
    useState(false);


    const [sidebarProductSlug, setSidebarProductSlug] =
  useState("");
  /* =========================================================
     SLUG HELPER
     ========================================================= */

  function slugify(value: string) {
    return value
      .trim()
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  /* =========================================================
     LOAD PRODUCTS
     ========================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      setLoading(true);

      const data =
        await getAllProducts();

      if (mounted) {
        setProducts(data);
        setLoading(false);
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     READ CATEGORY + SUBCATEGORY FROM URL
     ========================================================= */

  useEffect(() => {
    if (!products.length) return;

    const categoryParam =
      searchParams.get("category")?.trim() || "";

    const subcategoryParam =
      searchParams.get("subcategory")?.trim() || "";

    /* -------------------------------------------------------
       CATEGORY
       ------------------------------------------------------- */

    let matchedCategory = "";

    if (categoryParam) {
      matchedCategory =
        products.find((product) => {
          const productCategory =
            product.category?.name || "";

          return (
            slugify(productCategory) ===
            slugify(categoryParam)
          );
        })?.category?.name || "";
    }

    /* -------------------------------------------------------
       SUBCATEGORY

       First:
       category + subcategory

       Fallback:
       subcategory only
       ------------------------------------------------------- */

    let matchedSubcategory = "";

    if (subcategoryParam) {
      if (matchedCategory) {
        matchedSubcategory =
          products.find((product) => {
            const productCategory =
              product.category?.name || "";

            const productSubcategory =
              product.sub_category?.name || "";

            return (
              slugify(productCategory) ===
                slugify(matchedCategory) &&
              slugify(productSubcategory) ===
                slugify(subcategoryParam)
            );
          })?.sub_category?.name || "";
      }

      if (!matchedSubcategory) {
        matchedSubcategory =
          products.find((product) => {
            const productSubcategory =
              product.sub_category?.name || "";

            return (
              slugify(productSubcategory) ===
              slugify(subcategoryParam)
            );
          })?.sub_category?.name || "";
      }
    }

    setSelectedCategory(
      matchedCategory
    );

    setSelectedSubcategory(
      matchedSubcategory
    );
  }, [
    products,
    searchParams,
  ]);

  /* =========================================================
     FILTER + SEARCH + SORT
     ========================================================= */

  const filteredProducts = useMemo(() => {
    const query =
      search
        .trim()
        .toLowerCase();

    const result =
      products.filter((product) => {
        const productName =
          product.name?.toLowerCase() || "";

        const sku =
          product.sku?.toLowerCase() || "";

        const category =
          product.category?.name?.toLowerCase() ||
          "";

        const subcategory =
          product.sub_category?.name?.toLowerCase() ||
          "";

        const brand =
          product.brand?.name?.toLowerCase() ||
          "";

        /* -----------------------------------------------------
           SEARCH
           ----------------------------------------------------- */

        if (
          query &&
          !productName.includes(query) &&
          !sku.includes(query) &&
          !category.includes(query) &&
          !subcategory.includes(query) &&
          !brand.includes(query)
        ) {
          return false;
        }

        /* -----------------------------------------------------
           CATEGORY
           ----------------------------------------------------- */

        if (
          selectedCategory &&
          slugify(
            product.category?.name || ""
          ) !==
            slugify(selectedCategory)
        ) {
          return false;
        }

        /* -----------------------------------------------------
           SUBCATEGORY
           ----------------------------------------------------- */

        if (
          selectedSubcategory &&
          slugify(
            product.sub_category?.name || ""
          ) !==
            slugify(selectedSubcategory)
        ) {
          return false;
        }

        /* -----------------------------------------------------
           BRAND
           ----------------------------------------------------- */

        if (
          selectedBrand &&
          product.brand?.name !==
            selectedBrand
        ) {
          return false;
        }

        /* -----------------------------------------------------
           PRICE
           ----------------------------------------------------- */

        const productPrice =
          product.sale_price ??
          product.price;

        if (
          minPrice !== "" &&
          productPrice <
            Number(minPrice)
        ) {
          return false;
        }

        if (
          maxPrice !== "" &&
          productPrice >
            Number(maxPrice)
        ) {
          return false;
        }

        /* -----------------------------------------------------
           AVAILABILITY
           ----------------------------------------------------- */

        if (
          availability === "in-stock" &&
          product.stock <= 0
        ) {
          return false;
        }

        if (
          availability === "out-of-stock" &&
          product.stock > 0
        ) {
          return false;
        }

        return true;
      });

    /* =======================================================
       SORT
       ======================================================= */

    result.sort((a, b) => {
      switch (sort) {
        case "Price: Low to High":
          return (
            (a.sale_price ?? a.price) -
            (b.sale_price ?? b.price)
          );

        case "Price: High to Low":
          return (
            (b.sale_price ?? b.price) -
            (a.sale_price ?? a.price)
          );

        case "Name: A to Z":
          return a.name.localeCompare(
            b.name
          );

        case "Name: Z to A":
          return b.name.localeCompare(
            a.name
          );

        case "Newest":
        default:
          return 0;
      }
    });

    return result;
  }, [
    products,
    search,
    selectedCategory,
    selectedSubcategory,
    selectedBrand,
    minPrice,
    maxPrice,
    availability,
    sort,
  ]);

  /* =========================================================
     RESET FILTERS
     ========================================================= */

  function resetFilters() {
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedBrand("");
    setMinPrice("");
    setMaxPrice("");
    setAvailability("all");
  }

  /* =========================================================
     CATEGORY LIST
     ========================================================= */

  const categories = useMemo(() => {
    const map = new Map<
      string,
      string
    >();

    products.forEach((product) => {
      const name =
        product.category?.name?.trim();

      if (!name) return;

      const key =
        slugify(name);

      if (!map.has(key)) {
        map.set(key, name);
      }
    });

    return Array.from(
      map.values()
    );
  }, [products]);

  /* =========================================================
     NEW PRODUCTS
     
     Believers-style:
     Small image + product name + price
     ========================================================= */

  const newProducts = useMemo(() => {
    return products
      .filter(
        (product) =>
          product.new_arrival === true
      )
      .slice(0, 5);
  }, [products]);

  /* =========================================================
     SIDEBAR PRODUCT CLICK
     ========================================================= */

  function handleSidebarProductClick(
  product: WebsiteProduct
) {
  if (!product.slug) return;

  setSidebarProductSlug(product.slug);
}

  /* =========================================================
     PAGE
     ========================================================= */

  return (
    <>
      <Header />

      <main
        className="
          min-h-screen
          bg-[var(--theme-background)]
        "
      >
        {/* ===================================================
            PRODUCTS HEADER
            =================================================== */}

        <ProductsHeader
          total={
            filteredProducts.length
          }
          search={search}
          onSearchChange={
            setSearch
          }
          sort={sort}
          onSortChange={
            setSort
          }
          onMobileFilter={() =>
            setMobileFilterOpen(true)
          }
        />

        {/* ===================================================
            DESKTOP PRODUCTS AREA

            Believers style:

            LEFT
            - Categories
            - New Products

            RIGHT
            - Products
            =================================================== */}

        <Container>
          <div
            className="
              w-full
              py-5
              sm:py-6
              lg:py-7
            "
          >
            <div
              className="
                grid
                grid-cols-1
                gap-6

                lg:grid-cols-[250px_minmax(0,1fr)]
                lg:items-start
                lg:gap-6

                xl:grid-cols-[270px_minmax(0,1fr)]
                xl:gap-7
              "
            >
              {/* =================================================
                  LEFT SIDEBAR
                  ================================================= */}

              <aside
                className="
                  hidden
                  lg:block
                  lg:min-w-0
                "
              >
                {/* =================================================
    CATEGORIES
    ================================================= */}

<section>
  <div
    className="
      flex
      items-center
      justify-between
      border-b
      border-gray-200
      pb-2
    "
  >
    <h3
      className="
        text-sm
        font-semibold
        text-[#222222]
      "
    >
      Categories
    </h3>
  </div>

  <div
    className="
      mt-3
      max-h-[300px]
      overflow-y-auto
      pr-1
    "
  >
    {/* ALL */}

    <button
      type="button"
      onClick={() => {
        setSelectedCategory("");
        setSelectedSubcategory("");
      }}
      className="
        group
        flex
        w-full
        items-center
        gap-2
        py-[6px]
        text-left
        text-[13px]
        transition
      "
    >
      <span
        className="
          flex
          h-2
          w-2
          shrink-0
          items-center
          justify-center
        "
      >
        <span
          className="
            h-[5px]
            w-[5px]
            rounded-full
          "
          style={{
            background:
              !selectedCategory
                ? themeColor
                : "#E5E7EB",
          }}
        />
      </span>

      <span
        className={
          !selectedCategory
            ? "font-medium"
            : "text-[#555555]"
        }
        style={{
          color:
            !selectedCategory
              ? themeColor
              : undefined,
        }}
      >
        All
      </span>
    </button>

    {/* CATEGORIES */}

    {categories.map(
      (category) => {
        const active =
          slugify(
            selectedCategory
          ) ===
          slugify(category);

        return (
          <button
            key={category}
            type="button"
            onClick={() => {
              if (active) {
                setSelectedCategory("");
              } else {
                setSelectedCategory(
                  category
                );
              }

              setSelectedSubcategory("");
            }}
            className="
              group
              flex
              w-full
              items-center
              gap-2
              py-[6px]
              text-left
              text-[13px]
              transition
            "
          >
            <span
              className="
                flex
                h-2
                w-2
                shrink-0
                items-center
                justify-center
              "
            >
              <span
                className="
                  h-[5px]
                  w-[5px]
                  rounded-full
                "
                style={{
                  background:
                    active
                      ? themeColor
                      : "#E5E7EB",
                }}
              />
            </span>

            <span
              className={
                active
                  ? "font-medium"
                  : "text-[#555555]"
              }
              style={{
                color:
                  active
                    ? themeColor
                    : undefined,
              }}
            >
              {category}
            </span>
          </button>
        );
      }
    )}
  </div>
</section>

                {/* =================================================
                    NEW PRODUCTS
                    ================================================= */}

                <section
                  className="
                    mt-10
                  "
                >
                  <div
                    className="
                      border-b
                      border-gray-200
                      pb-2
                    "
                  >
                    <h3
                      className="
                        text-sm
                        font-semibold
                        text-[#222222]
                      "
                    >
                      New Products
                    </h3>
                  </div>

                  <div
                    className="
                      mt-4
                      space-y-4
                    "
                  >
                    {newProducts.map(
                      (product) => {
                        const price =
                          product.sale_price ??
                          product.price;

                        return (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() =>
                              handleSidebarProductClick(
                                product
                              )
                            }
                            className="
                              flex
                              w-full
                              items-start
                              gap-3
                              text-left
                              group
                            "
                          >
                            {/* Image */}

                            <div
                              className="
                                h-[58px]
                                w-[58px]
                                shrink-0
                                overflow-hidden
                                bg-white
                              "
                            >
                              {product.image_url ? (
                                <img
                                  src={
                                    product.image_url
                                  }
                                  alt={
                                    product.name
                                  }
                                  className="
                                    h-full
                                    w-full
                                    object-cover
                                    transition
                                    duration-300
                                    group-hover:scale-105
                                  "
                                />
                              ) : (
                                <div
                                  className="
                                    flex
                                    h-full
                                    w-full
                                    items-center
                                    justify-center
                                    bg-gray-100
                                    text-[10px]
                                    text-gray-400
                                  "
                                >
                                  No Image
                                </div>
                              )}
                            </div>

                            {/* Details */}

                            <div
                              className="
                                min-w-0
                                pt-[1px]
                              "
                            >
                              <p
                                className="
                                  line-clamp-2
                                  text-[12px]
                                  font-medium
                                  leading-[16px]
                                  text-[#222222]
                                  transition
                                  group-hover:opacity-70
                                "
                              >
                                {product.name}
                              </p>

                              <p
                                className="
                                  mt-1
                                  text-[12px]
                                  font-medium
                                "
                                style={{
                                  color:
                                    themeColor,
                                }}
                              >
                                ৳
                                {price.toLocaleString(
                                  "en-BD"
                                )}
                              </p>
                            </div>
                          </button>
                        );
                      }
                    )}

                    {!newProducts.length && (
                      <p
                        className="
                          text-xs
                          text-gray-400
                        "
                      >
                        No new products
                      </p>
                    )}
                  </div>
                </section>
              </aside>

              {/* =================================================
                  RIGHT PRODUCTS
                  ================================================= */}

              <section
                className="
                  min-w-0
                "
              >
                <ProductsGrid
                  products={
                    filteredProducts
                  }
                  loading={
                    loading
                  }
                />
              </section>
            </div>
          </div>
        </Container>

        {/* ===================================================
            MOBILE FILTER DRAWER

            Existing mobile filtering remains.
            =================================================== */}

        <MobileFilterDrawer
          open={
            mobileFilterOpen
          }
          onClose={() =>
            setMobileFilterOpen(
              false
            )
          }
          products={
            products
          }
          selectedCategory={
            selectedCategory
          }
          onCategoryChange={
            setSelectedCategory
          }
          selectedBrand={
            selectedBrand
          }
          onBrandChange={
            setSelectedBrand
          }
          minPrice={
            minPrice
          }
          maxPrice={
            maxPrice
          }
          onMinPriceChange={
            setMinPrice
          }
          onMaxPriceChange={
            setMaxPrice
          }
          availability={
            availability
          }
          onAvailabilityChange={
            setAvailability
          }
          onReset={
            resetFilters
          }
        />
      </main>

            <Footer />

      <ProductDetailsModal
  open={Boolean(sidebarProductSlug)}
  slug={sidebarProductSlug}
  onClose={() => setSidebarProductSlug("")}
  useHistory={false}
/>

      <MobileBottomNav />
    </>
  );
}