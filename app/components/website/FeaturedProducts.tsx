"use client";

import { useEffect, useState } from "react";
import Container from "./Container";
import ProductCard from "./ProductCard";
import {
  getFeaturedProducts,
  WebsiteProduct,
} from "@/lib/products";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<WebsiteProduct[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const data = await getFeaturedProducts();
    setProducts(data);
  }

  return (
    <section className="bg-[#F8F5EE] py-12 sm:py-14 lg:py-20">
      <Container>
        {/* Header */}
        <div className="mb-8 px-4 text-center sm:mb-10 lg:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#98691D] sm:text-sm">
            Featured Collection
          </p>

          <h2 className="mt-2 text-2xl font-bold leading-tight text-[#2B2B2B] sm:text-3xl lg:text-4xl">
            Best Selling Products
          </h2>

          <p className="mx-auto mt-3 max-w-xl px-2 text-sm leading-6 text-gray-500 sm:text-base">
            Discover our handpicked premium t-shirts.
          </p>
        </div>

        {/* Products */}
        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:gap-4
            md:grid-cols-3
            lg:grid-cols-4
            2xl:grid-cols-5
          "
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}