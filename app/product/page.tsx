"use client";

import { useEffect, useMemo, useState } from "react";

import Header from "@/app/components/website/Header";
import Footer from "@/app/components/website/Footer";
import Container from "@/app/components/website/Container";
import MobileBottomNav from "@/app/components/website/MobileBottomNav";

import {
  getAllProducts,
  WebsiteProduct,
} from "@/lib/products";

import ProductsHeader from "./ProductsHeader";
import ProductsFilter from "./ProductsFilter";
import ProductsGrid from "./ProductsGrid";
import MobileFilterDrawer from "./MobileFilterDrawer";

type SortOption =
  | "Newest"
  | "Price: Low to High"
  | "Price: High to Low"
  | "Name: A to Z"
  | "Name: Z to A";

export default function ProductsPage() {
  /* =========================================================
     PRODUCTS
     ========================================================= */

  const [products, setProducts] = useState<WebsiteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     SEARCH
     ========================================================= */

  const [search, setSearch] = useState("");

  /* =========================================================
     CATEGORY / BRAND
     ========================================================= */

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

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
     LOAD PRODUCTS
     ========================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        setLoading(true);

        const data = await getAllProducts();

        if (mounted) {
          setProducts(data);
        }
      } catch (error) {
        console.error(
          "Failed to load products:",
          error
        );

        if (mounted) {
          setProducts([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     FILTER + SEARCH + SORT
     ========================================================= */

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = products.filter((product) => {
      const productName =
        product.name?.toLowerCase() || "";

      const sku =
        product.sku?.toLowerCase() || "";

      const category =
        product.category?.name?.toLowerCase() || "";

      const brand =
        product.brand?.name?.toLowerCase() || "";

      /* -------------------------------------------------------
         SEARCH
         ------------------------------------------------------- */

      if (
        query &&
        !productName.includes(query) &&
        !sku.includes(query) &&
        !category.includes(query) &&
        !brand.includes(query)
      ) {
        return false;
      }

      /* -------------------------------------------------------
         CATEGORY
         ------------------------------------------------------- */

      if (
        selectedCategory &&
        product.category?.name !== selectedCategory
      ) {
        return false;
      }

      /* -------------------------------------------------------
         BRAND
         ------------------------------------------------------- */

      if (
        selectedBrand &&
        product.brand?.name !== selectedBrand
      ) {
        return false;
      }

      /* -------------------------------------------------------
         PRICE
         ------------------------------------------------------- */

      const productPrice =
        product.sale_price ?? product.price;

      if (
        minPrice !== "" &&
        productPrice < Number(minPrice)
      ) {
        return false;
      }

      if (
        maxPrice !== "" &&
        productPrice > Number(maxPrice)
      ) {
        return false;
      }

      /* -------------------------------------------------------
         AVAILABILITY
         ------------------------------------------------------- */

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

    /* ---------------------------------------------------------
       SORT
       --------------------------------------------------------- */

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
          return a.name.localeCompare(b.name);

        case "Name: Z to A":
          return b.name.localeCompare(a.name);

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
      {/* =====================================================
          HEADER
         ===================================================== */}

      <Header />

      {/* =====================================================
          MAIN
         ===================================================== */}

      <main className="min-h-screen bg-[#F8F5EE]">

        {/* ===================================================
            PRODUCTS HEADER + DESKTOP FILTER

            ProductsHeader handles:
            - Breadcrumb
            - Collection title
            - Search
            - Sort
            - Product count
            - Desktop filter panel
            - Mobile filter button
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

              selectedCategory={selectedCategory}
              onCategoryChange={
                setSelectedCategory
              }

              selectedBrand={selectedBrand}
              onBrandChange={
                setSelectedBrand
              }

              minPrice={minPrice}
              maxPrice={maxPrice}

              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}

              availability={availability}
              onAvailabilityChange={
                setAvailability
              }

              onReset={resetFilters}
            />
          }
        />

        {/* ===================================================
            PRODUCTS GRID
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
              products={filteredProducts}
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

          selectedCategory={selectedCategory}
          onCategoryChange={
            setSelectedCategory
          }

          selectedBrand={selectedBrand}
          onBrandChange={
            setSelectedBrand
          }

          minPrice={minPrice}
          maxPrice={maxPrice}

          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}

          availability={availability}
          onAvailabilityChange={
            setAvailability
          }

          onReset={resetFilters}
        />

      </main>

      {/* =====================================================
          FOOTER
         ===================================================== */}

      <Footer />

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION

          IMPORTANT:
          This was missing from the current uploaded file.
          It is required for mobile/tablet navigation.
         ===================================================== */}

      <MobileBottomNav />
    </>
  );
}