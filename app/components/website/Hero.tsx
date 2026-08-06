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
  ) {
    return;
  }

  const interval = setInterval(() => {
    setCurrent((prev) =>
      (prev + 1) % products.length
    );
  }, (settings?.hero_slide_interval || 5) * 1000);

  return () => clearInterval(interval);
}, [
  products.length,
  settings?.hero_auto_slide,
  settings?.hero_slide_interval,
]);

  if (!products.length) {
    return null;
  }

  const product = products[current];

  console.log(
  "Current Index:",
  current,
  "Total:",
  products.length,
  "Product:",
  product?.name
);

  return (
    <section className="bg-[#F8F5EE] overflow-hidden">
      <Container>

        <div className="grid items-center gap-8 py-8 sm:gap-10 sm:py-12 lg:min-h-[680px] lg:grid-cols-2 lg:gap-20 lg:py-16">

          {/* Left Side */}

          <div className="order-2 text-center lg:order-1 lg:text-left">

            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#98691D] sm:mb-3">
              {settings?.hero_subtitle || "NEW COLLECTION"}
            </p>

            
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-600 sm:text-base lg:mx-0">
              {settings?.hero_description ||
 product.short_description ||
 "Premium quality crafted for everyday comfort."}
            </p>

            <h1 className="text-5xl font-extrabold leading-tight text-[#1F2937] sm:text-6xl xl:text-7xl">
  {settings?.hero_title || "Wear Your Style"}
</h1>

            <div className="mt-6 flex flex-row justify-center gap-3 lg:justify-start">

              <Link
                href={`/product/${product.slug}`}
                className="rounded-xl bg-[#98691D] px-5 py-3 font-semibold text-white transition hover:bg-[#B48630]"
              >
                {settings?.hero_button_1_text || "Shop Now"}
              </Link>

              <Link
                href="/products"
                className="rounded-xl border border-[#98691D] px-5 py-3 font-semibold text-[#98691D] transition hover:bg-[#98691D] hover:text-white"
              >
                {settings?.hero_button_2_text || "Explore Collection"}
              </Link>

            </div>
          </div>


         {/* Right Side */}

<div className="order-1 flex justify-center px-2 sm:px-4 lg:order-2 lg:justify-end lg:px-0">
  <Link
    href={`/product/${product.slug}`}
    className="group relative block h-[360px] w-[95%] max-w-[380px] overflow-hidden rounded-[34px] bg-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:h-[430px] sm:max-w-[460px] lg:h-[560px] lg:w-full lg:max-w-[560px]"
  >
    <Image
  key={product.id}
  src={product.image_url || "/images/hero/hero.webp"}
  alt={product.name}
  fill
  unoptimized
      style={{
  transitionDuration: `${settings?.hero_transition_speed || 600}ms`,
}}
className="object-contain p-4 transition-transform duration-500 group-hover:scale-110 sm:p-6 lg:p-8"
    />
  </Link>
</div>

{/* Slider Dots */}

<div className="order-0 col-span-full -mb-2 flex justify-center gap-3 lg:order-none lg:mb-0 lg:mt-8">

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