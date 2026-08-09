"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/app/components/website/Header";
import Footer from "@/app/components/website/Footer";
import Container from "@/app/components/website/Container";

import {
  getAllProducts,
  WebsiteProduct,
} from "@/lib/products";

import ProductsHeader from "./ProductsHeader";
import ProductsFilter from "./ProductsFilter";
import ProductsGrid from "./ProductsGrid";
import MobileFilterDrawer from "./MobileFilterDrawer";
import MobileBottomNav from "@/app/components/website/MobileBottomNav";

type SortOption =
  | "Newest"
  | "Price: Low to High"
  | "Price: High to Low"
  | "Name: A to Z"
  | "Name: Z to A";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  /* =========================================================
     PRODUCTS
     ========================================================= */

  const [products, setProducts] = useState<
    WebsiteProduct[]
  >([]);

  const [loading, setLoading] = useState(true);

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

  const [minPrice, setMinPrice] = useState("");

  const [maxPrice, setMaxPrice] = useState("");

  /* =========================================================
     AVAILABILITY
     ========================================================= */

  const [availability, setAvailability] = useState<
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

      const data = await getAllProducts();

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

     Example:

     /product?category=man&subcategory=Polo

     or

     /product?category=polo-shirt&subcategory=Polo
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

       First try:
       category + subcategory

       If that combination doesn't exist,
       search subcategory independently.

       This makes the Header dropdown reliable even
       if category/subcategory database relationships
       are not perfectly aligned.
       ------------------------------------------------------- */

    let matchedSubcategory = "";

    if (subcategoryParam) {
      /* First: category + subcategory */
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

      /* -----------------------------------------------------
         Fallback: subcategory only
         ----------------------------------------------------- */

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

    /* -------------------------------------------------------
       APPLY URL FILTERS
       ------------------------------------------------------- */

    setSelectedCategory(matchedCategory);

    setSelectedSubcategory(
      matchedSubcategory
    );
  }, [products, searchParams]);

  /* =========================================================
     FILTER + SEARCH + SORT
     ========================================================= */

  const filteredProducts = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    const result = products.filter(
      (product) => {
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

           THIS IS THE MAIN FIX

           Header থেকে Polo select করলে:

           selectedSubcategory = "Polo"

           তখন শুধু Polo subcategory-এর
           products থাকবে।
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
      }
    );

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
     PAGE
     ========================================================= */

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8F5EE]">

        {/* ===================================================
            PRODUCTS HEADER + DESKTOP FILTER
            =================================================== */}

        <ProductsHeader
          total={filteredProducts.length}
          search={search}
          onSearchChange={setSearch}
          sort={sort}
          onSortChange={setSort}
          onMobileFilter={() =>
            setMobileFilterOpen(true)
          }
          desktopFilter={
            <ProductsFilter
              products={products}

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

              minPrice={minPrice}
              maxPrice={maxPrice}

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

              onReset={resetFilters}
            />
          }
        />

        {/* ===================================================
            PRODUCTS
            =================================================== */}

        <Container>
          <div
            className="
              py-4
              sm:py-5
              lg:py-5
            "
          >
            <ProductsGrid
              products={
                filteredProducts
              }
              loading={loading}
            />
          </div>
        </Container>

        {/* ===================================================
            MOBILE FILTER DRAWER
            =================================================== */}

        <MobileFilterDrawer
          open={mobileFilterOpen}

          onClose={() =>
            setMobileFilterOpen(false)
          }

          products={products}

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

          minPrice={minPrice}
          maxPrice={maxPrice}

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

          onReset={resetFilters}
        />

      </main>

      <Footer />
      <MobileBottomNav />
    </>
  );
}