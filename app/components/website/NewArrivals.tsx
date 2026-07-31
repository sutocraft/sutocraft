"use client";

import { useEffect, useState } from "react";
import Container from "./Container";
import {
  getNewArrivalProducts,
  WebsiteProduct,
} from "@/lib/product";


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
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-2xl border border-[#E8E1CE] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl lg:rounded-3xl"
            >
              {/* Image */}
<div className="relative h-[260px] sm:h-[320px] lg:h-[420px] w-full overflow-hidden bg-[#F8F5EE]">

  <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">

  <span className="rounded-full bg-[#98691D] px-2 py-1 text-[10px] font-semibold text-white sm:px-3 sm:text-xs">
    NEW
  </span>

  {product.discount_percentage > 0 && (
    <span className="rounded-full bg-red-600 px-2 py-1 text-[10px] font-bold text-white sm:px-3 sm:text-xs">
      -{product.discount_percentage}%
    </span>
  )}

</div>

  {product.image_url ? (
    <img
      src={product.image_url}
      alt={product.name}
      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center transition duration-300 group-hover:scale-110">
        <div className="text-5xl sm:text-6xl">👕</div>

        <p className="mt-2 text-xs text-gray-400 sm:text-sm">
          No Image
        </p>
      </div>
    </div>
  )}

</div>

              {/* Content */}
              <div className="p-4 lg:p-6">

                <h3 className="line-clamp-2 text-sm font-semibold text-[#2B2B2B] sm:text-base lg:text-lg">
                  {product.name}
                </h3>

                <div className="mt-3 flex flex-wrap items-center gap-2">

  <span className="text-lg font-bold text-[#98691D] sm:text-xl">
    ৳{product.sale_price ?? product.price}
  </span>

  {product.sale_price && (
    <span className="text-xs text-gray-400 line-through sm:text-sm">
      ৳{product.price}
    </span>
  )}

</div>

                <button className="mt-5 w-full rounded-xl bg-[#98691D] py-2.5 text-sm font-semibold text-white transition hover:bg-[#B48630] sm:py-3">
                  Add To Cart
                </button>

              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}