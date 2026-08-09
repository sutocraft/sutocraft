"use client";

import { useEffect, useState } from "react";
import Container from "./Container";
import ProductCard from "./ProductCard";

import {
  getFeaturedProducts,
  WebsiteProduct,
} from "@/lib/products";

import {
  useTheme,
} from "@/app/components/website/settings.theme_color";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<WebsiteProduct[]>([]);

  const {
    themeColor,
  } = useTheme();

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const data = await getFeaturedProducts();
    setProducts(data);
  }

  return (
    <section
      className="py-12 sm:py-14 lg:py-20"
      style={{
  background: "var(--theme-background)",
}}
    >
      <Container>

        {/* Header */}

        <div className="mb-8 px-4 text-center sm:mb-10 lg:mb-14">

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.35em]
              sm:text-sm
            "
            style={{
              color: themeColor,
            }}
          >
            FEATURED COLLECTION
          </p>

          <h2
            className="
              mt-2
              text-2xl
              font-bold
              leading-tight

              sm:text-3xl

              lg:text-4xl
            "
            style={{
              color: "#2B2B2B",
            }}
          >
            Best Selling Products
          </h2>

          <p
            className="
              mx-auto
              mt-3
              max-w-xl
              px-2
              text-sm
              leading-6

              sm:text-base
            "
            style={{
              color: "#6B7280",
            }}
          >
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