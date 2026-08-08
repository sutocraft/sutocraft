"use client";

import { useEffect, useState } from "react";

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

export default function ProductsPage() {
  const [products, setProducts] = useState<
    WebsiteProduct[]
  >([]);

  const [loading, setLoading] =
    useState(true);

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

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8F5EE]">

        <ProductsHeader
          total={products.length}
        />

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

            {/* Desktop Filter */}

            <ProductsFilter />

            {/* Products */}

            <ProductsGrid
              products={products}
              loading={loading}
            />

          </div>

        </Container>

      </main>

      <Footer />
    </>
  );
}