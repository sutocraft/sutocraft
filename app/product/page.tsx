"use client";

import { useEffect, useState } from "react";

import Header from "@/app/components/website/Header";
import Footer from "@/app/components/website/Footer";
import Container from "@/app/components/website/Container";

import { WebsiteProduct, getAllProducts } from "@/lib/products";

import ProductsHeader from "./ProductsHeader";
import ProductsFilter from "./ProductsFilter";
import ProductsGrid from "./ProductsGrid";

export default function ProductsPage() {
  const [products, setProducts] = useState<WebsiteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);

    const data = await getAllProducts();

    setProducts(data);

    setLoading(false);
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8F5EE]">

        <ProductsHeader
          total={products.length}
        />

        <Container>

          <div className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-[280px_1fr]">

            <ProductsFilter />

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