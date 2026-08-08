"use client";

import { useEffect, useMemo, useState } from "react";

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
  const [products, setProducts] = useState<WebsiteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [availability, setAvailability] = useState<
    "all" | "in-stock" | "out-of-stock"
  >("all");

  const [sort, setSort] =
    useState<SortOption>("Newest");

  const [mobileFilterOpen, setMobileFilterOpen] =
    useState(false);

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

      // Search
      if (
        query &&
        !productName.includes(query) &&
        !sku.includes(query) &&
        !category.includes(query) &&
        !brand.includes(query)
      ) {
        return false;
      }

      // Category
      if (
        selectedCategory &&
        product.category?.name !== selectedCategory
      ) {
        return false;
      }

      // Brand
      if (
        selectedBrand &&
        product.brand?.name !== selectedBrand
      ) {
        return false;
      }

      // Price
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

      // Availability
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

    // Sort
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

  function resetFilters() {
    setSelectedCategory("");
    setSelectedBrand("");
    setMinPrice("");
    setMaxPrice("");
    setAvailability("all");
  }

  return (
    <>
      {/* =========================
          WEBSITE HEADER
      ========================= */}
      <Header />

      <main className="relative z-0 min-h-screen bg-[#F8F5EE]">
        {/* =========================
            PRODUCTS HEADER
        ========================= */}
        <ProductsHeader
          total={filteredProducts.length}
          search={search}
          onSearchChange={setSearch}
          sort={sort}
          onSortChange={setSort}
          onMobileFilter={() =>
            setMobileFilterOpen(true)
          }
        />

        {/* =========================
            PRODUCTS CONTENT
        ========================= */}
        <Container>
          <div
            className="
              grid
              grid-cols-1
              gap-6
              py-6
              sm:gap-8
              sm:py-8
              lg:grid-cols-[260px_minmax(0,1fr)]
              xl:grid-cols-[280px_minmax(0,1fr)]
            "
          >
            {/* =========================
                DESKTOP FILTER
            ========================= */}
            <div className="hidden lg:block">
              <ProductsFilter
                products={products}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedBrand={selectedBrand}
                onBrandChange={setSelectedBrand}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onMinPriceChange={setMinPrice}
                onMaxPriceChange={setMaxPrice}
                availability={availability}
                onAvailabilityChange={setAvailability}
                onReset={resetFilters}
              />
            </div>

            {/* =========================
                PRODUCTS GRID
            ========================= */}
            <ProductsGrid
              products={filteredProducts}
              loading={loading}
            />
          </div>
        </Container>

        {/* =========================
            MOBILE FILTER DRAWER
        ========================= */}
        <MobileFilterDrawer
          open={mobileFilterOpen}
          onClose={() =>
            setMobileFilterOpen(false)
          }
          products={products}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedBrand={selectedBrand}
          onBrandChange={setSelectedBrand}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          availability={availability}
          onAvailabilityChange={setAvailability}
          onReset={resetFilters}
        />
      </main>

      {/* =========================
          FOOTER
      ========================= */}
      <Footer />
      <MobileBottomNav />
    </>
  );
}