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
          grid-cols-2
          gap-3
          sm:gap-4
          md:grid-cols-3
          xl:grid-cols-4
          2xl:grid-cols-5
        "
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <ProductsSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-[#E8E1CE] bg-white px-6 text-center">
        <div>
          <div className="text-5xl">🛍️</div>

          <h2 className="mt-4 text-xl font-bold text-[#2B2B2B]">
            No Products Found
          </h2>

          <p className="mt-2 text-sm text-[#6B7280]">
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
  );
}