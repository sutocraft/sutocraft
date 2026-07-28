"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "./Container";
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
            <div
              key={product.id}
              className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative overflow-hidden bg-[#F8F5EE]">

                {product.new_arrival && (
  <span className="absolute left-3 top-3 rounded-full bg-[#98691D] px-3 py-1 text-xs font-semibold text-white">
    NEW
  </span>
)}

                <button className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow transition hover:bg-[#98691D] hover:text-white">
                  ♡
                </button>

                <div className="relative h-[260px] sm:h-[320px] lg:h-[420px] w-full overflow-hidden bg-[#F8F5EE]">

  {product.image_url ? (
    <img
      src={product.image_url}
      alt={product.name}
      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <div className="text-5xl">👕</div>
        <p className="mt-2 text-sm text-gray-400">No Image</p>
      </div>
    </div>
  )}

</div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-4 lg:p-5">

                <div className="mb-2 text-xs text-yellow-500 sm:text-sm">
                  ★★★★★
                  <span className="ml-2 text-gray-500">
                    (24 Reviews)
                  </span>
                </div>

                <h3 className="line-clamp-2 text-sm font-semibold text-[#2B2B2B] sm:text-lg">
                  {product.name}
                </h3>

                <div className="mt-3 flex items-center gap-2">

  <span className="text-xl font-bold text-[#98691D] sm:text-2xl">
    ৳{product.sale_price ?? product.price}
  </span>

  {product.sale_price && (
    <span className="text-sm text-gray-400 line-through">
      ৳{product.price}
    </span>
  )}

</div>

                <button className="mt-auto w-full rounded-xl bg-[#98691D] py-2.5 text-sm font-semibold text-white transition hover:bg-[#B48630] sm:py-3">
  Add to Cart
</button>

              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}