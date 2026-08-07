"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Play,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import Container from "./Container";
import type { WebsiteProduct } from "@/lib/products";

import {
  getHeroProducts,
} from "@/lib/products";

import {
  useTheme,
} from "./settings.theme_color";



type HeroProps = {
  products?: WebsiteProduct[];
  settings?: unknown;
};

export default function Hero({
  products: initialProducts = [],
}: HeroProps) {

  const {
    themeColor,
  } = useTheme();

  const [products, setProducts] =
  useState<WebsiteProduct[]>(initialProducts);

  const [current, setCurrent] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

  if (initialProducts.length > 0) {
    setLoading(false);
    return;
  }

  loadHero();

}, [initialProducts]);

  async function loadHero() {

    setLoading(true);

    const data =
      await getHeroProducts();

    setProducts(data ?? []);

    setLoading(false);

  }

  useEffect(() => {

    if (products.length <= 1)
      return;

    const timer =
      setInterval(() => {

        setCurrent((prev) =>
          prev + 1 >= products.length
            ? 0
            : prev + 1
        );

      }, 4500);

    return () =>
      clearInterval(timer);

  }, [products]);

  const product =
    useMemo(() => {

      return (
        products[current] ??
        null
      );

    }, [
      current,
      products,
    ]);

  if (loading) {

    return (

      <section className="bg-[#F8F5EE]">

        <Container>

          <div className="grid min-h-[720px] animate-pulse items-center gap-16 lg:grid-cols-2">

            <div>

              <div className="mb-6 h-4 w-40 rounded-full bg-gray-200" />

              <div className="mb-5 h-16 w-full rounded-xl bg-gray-200" />

              <div className="mb-3 h-5 w-[85%] rounded bg-gray-200" />

              <div className="mb-10 h-5 w-[70%] rounded bg-gray-200" />

              <div className="flex gap-4">

                <div className="h-14 w-40 rounded-2xl bg-gray-200" />

                <div className="h-14 w-44 rounded-2xl bg-gray-200" />

              </div>

            </div>

            <div className="mx-auto aspect-square w-full max-w-[560px] rounded-[40px] bg-gray-200" />

          </div>

        </Container>

      </section>

    );

  }

  if (!product)
    return null;

    return (

    <section className="relative overflow-hidden bg-[#F8F5EE]">

      {/* Background */}

      <div className="absolute inset-0">

        <div
          className="absolute -left-32 top-20 h-72 w-72 rounded-full blur-[120px]"
          style={{
            background: `${themeColor}18`,
          }}
        />

        <div
          className="absolute -right-24 bottom-16 h-80 w-80 rounded-full blur-[130px]"
          style={{
            background: `${themeColor}14`,
          }}
        />

      </div>

      <Container>

        <div
  className="
    relative
    grid
    min-h-auto
    items-center
    gap-8
    py-6

    lg:min-h-[760px]
    lg:gap-14
    lg:py-10
    lg:grid-cols-[1fr_560px]
  "
>

          {/* =======================
              Left
          ======================= */}

          <AnimatePresence mode="wait">

            <motion.div
  className="
    order-2
    text-center

    lg:order-1
    lg:text-left
  "
              key={product.id}
              initial={{
                opacity: 0,
                x: -40,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -40,
              }}
              transition={{
                duration: .45,
              }}
            >

              <span
                className="mb-2 inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[.35em]"
                style={{
                  background: `${themeColor}15`,
                  color: themeColor,
                }}
              >
                {product.badge ?? "New Collection 2026"}
              </span>

              <h1
  className="
    mx-auto
    max-w-full
    text-4xl
    font-black
    leading-tight
    text-[#1E293B]

    sm:text-5xl

    lg:mx-0
    lg:max-w-[650px]
    lg:text-7xl
  "
>

                {product.name}

              </h1>

              <p
  className="
    mx-auto
    mt-2
    max-w-full
    text-base
    leading-8
    text-[#5B6473]

    lg:mx-0
    lg:mt-7
    lg:max-w-[620px]
    lg:text-lg
    lg:leading-9
  "
>

                {product.short_description ??
                  "Premium quality clothing crafted with comfort, durability and timeless design."}

              </p>

              <div
  className="
    mt-2
    flex
    flex-col
    gap-4

    sm:flex-row
    sm:justify-center

    lg:mt-10
    lg:justify-start
  "
>

               <Link
  href={`/product/${product.slug}`}
  className="
    inline-flex
    h-12
    w-full
    items-center
    justify-center
    gap-3
    rounded-2xl
    px-8
    font-bold
    text-white
    shadow-xl
    transition-all
    duration-300
    hover:scale-[1.02]

    sm:w-auto
    lg:w-auto
  "
   style={{
                    background: themeColor,
                  }}
                >
                  Shop Now

                  <ArrowRight
                    size={18}
                  />

                </Link>

                <button
  className="
    inline-flex
    h-12
    w-full
    items-center
    justify-center
    gap-3
    rounded-2xl
    border
    bg-white
    px-8
    font-bold
    transition-all
    duration-300
    hover:shadow-lg

    sm:w-auto
    lg:w-auto
  "
                  style={{
                    borderColor: themeColor,
                    color: themeColor,
                  }}
                >

                  <Play
                    size={18}
                  />

                  Explore Collection

                </button>

              </div>

                            <div
  className="
    mt-6
    flex
    flex-col
    items-center
    gap-4

    lg:mt-12
    lg:flex-row
    lg:items-center
    lg:gap-8
  "
>

                <div>

                  <p
                    className="text-sm uppercase tracking-[.3em]"
                    style={{
                      color: themeColor,
                    }}
                  >
                    Starting From
                  </p>

                  <div
  className="
    mt-2
    flex
    items-end
    justify-center
    gap-3

    lg:justify-start
  "
>

                    <span
                      className="text-5xl font-black"
                      style={{
                        color: themeColor,
                      }}
                    >
                      ৳
                      {product.sale_price ??
                        product.price}
                    </span>

                    {product.sale_price && (

                      <span className="pb-2 text-xl text-gray-400 line-through">

                        ৳
                        {product.price}

                      </span>

                    )}

                  </div>

                </div>

              </div>

            </motion.div>

          </AnimatePresence>

          {/* =======================
              Right
          ======================= */}

          <AnimatePresence
            mode="wait"
          >

            <motion.div
              key={product.image_url}
              initial={{
                opacity: 0,
                scale: .92,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: .92,
              }}
              transition={{
                duration: .45,
              }}
              className="relative mx-auto w-full max-w-[560px]"
            >

              <div className="rounded-[42px] bg-white p-7 shadow-[0_25px_80px_rgba(0,0,0,.10)]">

                <div className="relative aspect-square overflow-hidden rounded-[30px]">

                  <Image
                    src={
                      product.image_url ??
                      "/images/hero.webp"
                    }
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width:768px) 100vw, 560px"
                    className="object-contain transition-transform duration-500 hover:scale-105"
                  />

                </div>

              </div>

                            {/* Floating Badge */}

              <div
                className="absolute -left-8 top-10 hidden rounded-2xl bg-white px-5 py-4 shadow-xl lg:block"
              >
                <p
                  className="text-xs font-bold uppercase tracking-[.25em]"
                  style={{
                    color: themeColor,
                  }}
                >
                  Best Seller
                </p>

                <p className="mt-1 text-2xl font-black text-[#1E293B]">
                  Premium
                </p>
              </div>

              {/* Rating Card */}

              <div className="absolute -bottom-6 right-8 hidden rounded-2xl bg-white px-6 py-4 shadow-2xl lg:block">

                <div className="flex items-center gap-3">

                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-white"
                    style={{
                      background: themeColor,
                    }}
                  >
                    ★
                  </div>

                  <div>

                    <p className="text-lg font-bold text-[#1E293B]">

                      4.9 / 5

                    </p>

                    <p className="text-sm text-[#64748B]">

                      Customer Rating

                    </p>

                  </div>

                </div>

              </div>

            </motion.div>

          </AnimatePresence>

          {/* Slider Dots */}

          {products.length > 1 && (

            <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-3">

              {products.map((_, index) => (

                <button
                  key={index}
                  onClick={() =>
                    setCurrent(index)
                  }
                  className={`h-3 rounded-full transition-all duration-300 ${
                    current === index
                      ? "w-10"
                      : "w-3"
                  }`}
                  style={{
                    background:
                      current === index
                        ? themeColor
                        : "#D4D4D8",
                  }}
                />

              ))}

            </div>

          )}

        </div>

      </Container>

    </section>

  );

}