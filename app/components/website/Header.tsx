"use client";

import Link from "next/link";
import { useState } from "react";
import Container from "./Container";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E8E1CE] bg-white">
      <Container>
        {/* Top Bar */}
        <div className="flex h-16 items-center justify-between lg:h-[72px]">
          {/* Logo */}
          <Link
            href="/"
            className="text-3xl font-bold tracking-tight text-[#98691D] lg:text-5xl"
          >
            SutoCraft
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden items-center gap-10 lg:flex">
            <Link
              href="/"
              className="font-semibold text-[#2B2B2B] transition hover:text-[#98691D]"
            >
              Home
            </Link>

            <Link
              href="/products"
              className="font-semibold text-[#2B2B2B] transition hover:text-[#98691D]"
            >
              Products
            </Link>

            <Link
              href="/about"
              className="font-semibold text-[#2B2B2B] transition hover:text-[#98691D]"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="font-semibold text-[#2B2B2B] transition hover:text-[#98691D]"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Right */}
          <div className="hidden items-center gap-3 lg:flex">
            <button className="rounded-xl border border-[#98691D] px-6 py-3 font-semibold text-[#98691D] transition hover:bg-[#98691D] hover:text-white">
              Login
            </button>

            <button className="rounded-xl bg-[#98691D] px-6 py-3 font-semibold text-white transition hover:bg-[#B48630]">
              Cart (0)
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#98691D] text-2xl font-bold text-[#98691D] lg:hidden"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="border-t border-[#E8E1CE] bg-white py-6 lg:hidden">
            <nav className="flex flex-col gap-6">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="text-xl font-semibold text-[#2B2B2B] transition hover:text-[#98691D]"
              >
                Home
              </Link>

              <Link
                href="/products"
                onClick={() => setMenuOpen(false)}
                className="text-xl font-semibold text-[#2B2B2B] transition hover:text-[#98691D]"
              >
                Products
              </Link>

              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="text-xl font-semibold text-[#2B2B2B] transition hover:text-[#98691D]"
              >
                About
              </Link>

              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="text-xl font-semibold text-[#2B2B2B] transition hover:text-[#98691D]"
              >
                Contact
              </Link>

              <button className="mt-2 rounded-xl border border-[#98691D] py-3 text-lg font-semibold text-[#98691D] transition hover:bg-[#98691D] hover:text-white">
                Login
              </button>

              <button className="rounded-xl bg-[#98691D] py-3 text-lg font-semibold text-white transition hover:bg-[#B48630]">
                Cart (0)
              </button>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}