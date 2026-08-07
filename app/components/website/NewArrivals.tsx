"use client";

import { useEffect, useState } from "react";
import Container from "./Container";
import ProductCard from "./ProductCard";
import {
  getNewArrivalProducts,
  WebsiteProduct,
} from "@/lib/products";

export default function NewArrivals() {
  const [products, setProducts] = useState<WebsiteProduct[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const data = await getNewArrivalProducts();
    setProducts(data);
  }

  return (
    <section className="bg-white py-12 sm:py-14 lg:py-20">
      <Container>
        {/* Header */}
        <div className="mb-8 px-4 text-center sm:mb-10 lg:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#98691D] sm:text-sm">
            New Arrivals
          </p>

          <h2 className="mt-2 text-2xl font-bold leading-tight text-[#2B2B2B] sm:text-3xl lg:text-4xl">
            Just Arrived
          </h2>

          <p className="mx-auto mt-3 max-w-xl px-2 text-sm leading-6 text-gray-500 sm:text-base">
            Fresh styles added to our latest collection.
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
            xl:grid-cols-4
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