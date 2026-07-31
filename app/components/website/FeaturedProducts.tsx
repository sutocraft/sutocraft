"use client";

import { useEffect, useState } from "react";
import Container from "./Container";
import ProductCard from "./ProductCard";
import {
  getFeaturedProducts,
  WebsiteProduct,
} from "@/lib/product";


export default function FeaturedProducts() {

  const [products, setProducts] = useState<WebsiteProduct[]>([]);

useEffect(() => {
  loadProducts();
}, []);

async function loadProducts() {
  const data = await getFeaturedProducts();
  setProducts(data);
}
console.log(products);
  return (
    <section className="bg-[#F8F5EE] py-16 lg:py-20">
      <Container>
        {/* Header */}
        <div className="mb-10 text-center lg:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#98691D] sm:text-sm">
            Featured Collection
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#2B2B2B] sm:text-4xl">
            Best Selling Products
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm text-gray-500 sm:text-base">
            Discover our handpicked premium t-shirts.
          </p>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
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