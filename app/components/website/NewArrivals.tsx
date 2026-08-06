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
    <section className="bg-white py-16 lg:py-20">
      <Container>
        {/* Header */}
        <div className="mb-10 text-center lg:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#98691D] sm:text-sm">
            New Arrivals
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#2B2B2B] sm:text-4xl">
            Just Arrived
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm text-gray-500 sm:text-base">
            Fresh styles added to our latest collection.
          </p>
        </div>

        {/* Products */}
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))] lg:gap-8">
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