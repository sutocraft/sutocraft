"use client";

import Container from "./Container";
import { useTheme } from "./settings.theme_color";

export default function Newsletter() {
  const { themeColor } = useTheme();

  return (
    <section
      className="py-16 lg:py-24"
      style={{
        background: themeColor,
      }}
    >
      <Container>
        <div className="mx-auto max-w-4xl text-center">

          <p
            className="text-xs font-semibold uppercase tracking-[0.35em] sm:text-sm"
            style={{
              color: `${themeColor}F6`,
            }}
          >
            Stay Connected
          </p>

          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-6xl">
            Subscribe To Our Newsletter
          </h2>

          <p
            className="mx-auto mt-6 max-w-2xl text-sm leading-7 sm:text-base lg:text-lg lg:leading-8"
            style={{
              color: `${themeColor}F8`,
            }}
          >
            Get exclusive offers, new arrivals and special discounts
            delivered directly to your inbox.
          </p>

          {/* Form */}
          <div className="mx-auto mt-10 flex w-full max-w-3xl flex-col gap-4 sm:flex-row">

            <input
              type="email"
              placeholder="Enter your email address"
              className="h-14 w-full rounded-xl border-none bg-white px-5 text-base text-gray-800 outline-none placeholder:text-gray-400 lg:h-16 lg:px-6 lg:text-lg"
            />

            <button className="h-14 rounded-xl bg-[#222222] px-8 font-semibold text-white transition duration-300 hover:bg-black lg:h-16 lg:px-12">
              Subscribe
            </button>

          </div>

        </div>
      </Container>
    </section>
  );
}