"use client";

import ProductCard from "@/app/components/website/ProductCard";
import ProductsSkeleton from "./ProductsSkeleton";

import type { WebsiteProduct } from "@/lib/products";

type Props = {
  products: WebsiteProduct[];
  loading: boolean;
};

export default function ProductsGrid({
  products,
  loading,
}: Props) {
  if (loading) {
    return (
      <div
        className="
          grid
          w-full
          gap-3
          sm:gap-4
          [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]
        "
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductsSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-[var(--theme-primary-border)] bg-white px-6 text-center">
        <div>
          <div className="text-5xl">
            🛍️
          </div>

          <h2 className="mt-4 text-xl font-bold text-[#2B2B2B]">
            No Products Found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            We couldn't find any products at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        grid
        w-full
        items-start
        justify-items-stretch
        gap-3
        sm:gap-4
        [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]
      "
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}