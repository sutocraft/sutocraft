"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "./Container";
import type { WebsiteProduct } from "@/lib/products";

type Props = {
  products: WebsiteProduct[];
  settings: any;
};

export default function Hero({
  products,
  settings,
}: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (
  products.length <= 1 ||
  !settings?.hero_auto_slide
)
  return;

    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === products.length - 1 ? 0 : prev + 1
      );
    }, (settings?.hero_slide_interval || 5) * 1000);

    return () => clearInterval(interval);
  }, [products]);

  if (!products.length) {
    return null;
  }

  const product = products[current];

  return (
    <section className="bg-[#F8F5EE]">
      <Container>

        <div className="grid items-center gap-12 py-16 lg:min-h-[620px] lg:grid-cols-2 lg:gap-20">

          {/* Left Side */}

          <div className="order-2 text-center lg:order-1 lg:text-left">

            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-[#98691D]">
              {settings?.hero_subtitle || "NEW COLLECTION"}
            </p>

            
            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-gray-600 lg:mx-0">
              {settings?.hero_description ||
 product.short_description ||
 "Premium quality crafted for everyday comfort."}
            </p>

            <h1 className="text-5xl font-extrabold leading-tight text-[#1F2937] sm:text-6xl xl:text-7xl">
  {settings?.hero_title || "Wear Your Style"}
</h1>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">

              <Link
                href={`/product/${product.slug}`}
                className="rounded-xl bg-[#98691D] px-8 py-4 font-semibold text-white transition hover:bg-[#B48630]"
              >
                {settings?.hero_button_1_text || "Shop Now"}
              </Link>

              <Link
                href="/products"
                className="rounded-xl border border-[#98691D] px-8 py-4 font-semibold text-[#98691D] transition hover:bg-[#98691D] hover:text-white"
              >
                {settings?.hero_button_2_text || "Explore Collection"}
              </Link>

            </div>
          </div>


         {/* Right Side */}

<div className="order-1 flex justify-center lg:order-2 lg:justify-end">
  <Link
    href={`/product/${product.slug}`}
    className="group relative block h-[280px] w-full max-w-[320px] overflow-hidden rounded-[30px] bg-white shadow-sm transition hover:shadow-xl sm:h-[360px] sm:max-w-[420px] lg:h-[460px] lg:max-w-[520px]"
  >
    <Image
      src={product.image_url || "/images/hero/hero.webp"}
      alt={product.name}
      fill
      priority
      style={{
  transitionDuration: `${settings?.hero_transition_speed || 600}ms`,
}}
className="object-contain p-6 transition group-hover:scale-105"
    />
  </Link>
</div>

{/* Slider Dots */}

<div className="col-span-full mt-8 flex justify-center gap-3">

  {products.map((_, index) => (

    <button
      key={index}
      onClick={() => setCurrent(index)}
      className={`h-3 w-3 rounded-full transition ${
        current === index
          ? "bg-[#98691D] w-8"
          : "bg-gray-300"
      }`}
    />

  ))}

</div>


        </div>
      </Container>
    </section>
  );
}