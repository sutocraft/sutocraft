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

          <div className="grid min-h-[620px] animate-pulse items-center gap-10 lg:grid-cols-2">

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

            <div className="grid min-h-[620px] animate-pulse items-center gap-10 lg:grid-cols-2">
  ...
  <div className="mx-auto aspect-square w-full max-w-[520px] rounded-[40px] bg-gray-200" />
</div>

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

gap-8

pt-6
pb-20

lg:pt-4
lg:pb-10

items-center

lg:grid-cols-[1fr_460px]
lg:min-h-[540px]
lg:gap-8
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
  className="
    mb-2
    inline-flex
    rounded-full
    px-4
    py-2
    text-xs
    font-bold
    uppercase
    tracking-[.35em]

    lg:mb-5
  "
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

    font-black
    text-[#1E293B]

    text-[38px]
    leading-[1.05]

    sm:text-5xl

    lg:mx-0
    lg:max-w-[650px]
    lg:text-6xl

    min-h-[58px]
    sm:min-h-[70px]
    lg:min-h-[120px]

    flex
    items-center
    justify-center

    lg:justify-start

    text-balance
    break-words
  "
  style={{
  fontSize:
    product.name.length > 40
      ? "1.75rem"
      : product.name.length > 28
      ? "2rem"
      : undefined,
}}
>
  {product.name}
</h1>

              <p
  className="
    mx-auto
    mt-1

    max-w-full

    text-base
    leading-6
    text-[#5B6473]

    lg:mx-0
    lg:mt-3
    lg:max-w-[620px]
    lg:text-lg
    lg:leading-8

    min-h-[36px]
    sm:min-h-[40px]
    lg:min-h-[40px]

    flex
    items-center
    justify-center

    lg:justify-start
  "
>
  {product.short_description ??
    "Premium quality clothing crafted with comfort, durability and timeless design."}
</p>

              <div
  className="
    mt-3

    flex
    flex-col
    gap-3

    sm:flex-row
    sm:justify-center

    lg:mt-4
lg:justify-start

h-[60px]

    flex-shrink-0
  "
>

                <Link
  href={`/product/${product.slug}`}
  className="
    inline-flex
    h-14
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
    hover:scale-[1.03]

    sm:w-auto
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
    h-14
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
    mt-4

    flex
    justify-center

    lg:mt-4
lg:justify-start

h-[70px]

    flex-shrink-0
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

                  <div className="mt-2 flex items-end gap-3">

                    <span
  className="
    text-4xl
    font-black

    lg:text-5xl
  "
                      style={{
                        color: themeColor,
                      }}
                    >
                      ৳
                      {product.sale_price ??
                        product.price}
                    </span>

                    {product.sale_price && (

                      <span
  className="
    pb-1
    text-lg
    text-gray-400
    line-through

    lg:pb-2
    lg:text-xl
  "
>

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
  className="
    order-1
    relative
    mx-auto
    w-full
    max-w-[340px]

    sm:max-w-[420px]

    lg:order-2
    lg:max-w-[460px]
  "
  initial={{
    opacity: 0,
    scale: 0.92,
  }}
  animate={{
    opacity: 1,
    scale: 1,
  }}
  exit={{
    opacity: 0,
    scale: 0.92,
  }}
  transition={{
    duration: 0.45,
  }}
>


              <div
  className="
    rounded-[26px]
    bg-white
    p-4
    shadow-[0_18px_50px_rgba(0,0,0,.10)]

    sm:p-5

    lg:rounded-[42px]
    lg:p-7
    lg:shadow-[0_25px_80px_rgba(0,0,0,.10)]
  "
>

                <div
  className="
    relative
    aspect-square
    overflow-hidden
    rounded-[20px]

    lg:rounded-[30px]
  "
>

                  <Image
  src={
    product.image_url ??
    "/images/hero.webp"
  }
  alt={product.name}
  fill
  priority
  sizes="(max-width:640px) 90vw,(max-width:1024px) 60vw,560px"
  className="object-contain transition-transform duration-500"
                  />

                </div>

              </div>

              

              {/* Rating Card */}

              <div
  className="
    absolute
    bottom-2
    right-2
    rounded-xl
    bg-white
    px-1
    py-1
    shadow-xl

    lg:-bottom-0
    lg:right-0
    lg:rounded-2xl
    lg:px-4
    lg:py-2
  "
>

                <div className="flex items-center gap-3">

                  <div
  className="
    flex
    h-6
    w-6
    items-center
    justify-center
    rounded-full
    text-white

    lg:h-6
    lg:w-6
  "

                    style={{
                      background: themeColor,
                    }}
                  >
                    ★
                  </div>

                  <div>

                    <p
  className="
    text-[10px]
    font-bold
    text-[#1E293B]

    lg:text-lg
  "
>

                      4.9 / 5

                    </p>

                    

                  </div>

                </div>

              </div>

            </motion.div>

          </AnimatePresence>

          {/* Slider Dots */}

          {products.length > 1 && (

            <div
  className="
    absolute

    bottom-6
left-1/2
flex
-translate-x-1/2
gap-4

lg:bottom-2
  "
>

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