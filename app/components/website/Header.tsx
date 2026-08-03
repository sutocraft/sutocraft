"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Container from "./Container";
import { getHeaderSettings } from "@/lib/header";

type HeaderSettings = {
  website_name: string;
  logo_url: string;
  theme_color: string;
};

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [settings, setSettings] =
    useState<HeaderSettings>({
      website_name: "SutoCraft",
      logo_url: "",
      theme_color: "#98691D",
    });

  useEffect(() => {
    async function loadSettings() {
      const data = await getHeaderSettings();
      setSettings(data);
    }

    loadSettings();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E8E1CE] bg-white">

      <Container>

        {/* Top Bar */}

        <div className="flex h-16 items-center justify-between lg:h-[72px]">

          {/* Logo */}

          <Link
            href="/"
            className="flex items-center gap-3"
          >

            {settings.logo_url ? (

              <Image
                src={settings.logo_url}
                alt={settings.website_name}
                width={180}
                height={60}
                className="h-12 w-auto object-contain"
                priority
              />

            ) : (

              <span
                className="text-3xl font-bold tracking-tight lg:text-5xl"
                style={{
                  color: settings.theme_color,
                }}
              >
                {settings.website_name}
              </span>

            )}

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

            <button
              className="rounded-xl border px-6 py-3 font-semibold transition hover:text-white"
              style={{
                borderColor: settings.theme_color,
                color: settings.theme_color,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  settings.theme_color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "transparent";
              }}
            >
              Login
            </button>

            <button
              className="rounded-xl px-6 py-3 font-semibold text-white transition hover:opacity-90"
              style={{
                backgroundColor:
                  settings.theme_color,
              }}
            >
              Cart (0)
            </button>

          </div>

          {/* Mobile Menu Button */}

          <button
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            className="flex h-11 w-11 items-center justify-center rounded-xl border-2 text-2xl font-bold lg:hidden"
            style={{
              borderColor:
                settings.theme_color,
              color:
                settings.theme_color,
            }}
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
                onClick={() =>
                  setMenuOpen(false)
                }
                className="text-xl font-semibold text-[#2B2B2B] transition hover:text-[#98691D]"
              >
                Home
              </Link>

              <Link
                href="/products"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="text-xl font-semibold text-[#2B2B2B] transition hover:text-[#98691D]"
              >
                Products
              </Link>

              <Link
                href="/about"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="text-xl font-semibold text-[#2B2B2B] transition hover:text-[#98691D]"
              >
                About
              </Link>

              <Link
                href="/contact"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="text-xl font-semibold text-[#2B2B2B] transition hover:text-[#98691D]"
              >
                Contact
              </Link>

              <button
                className="mt-2 rounded-xl border py-3 text-lg font-semibold transition hover:text-white"
                style={{
                  borderColor:
                    settings.theme_color,
                  color:
                    settings.theme_color,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    settings.theme_color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "transparent";
                }}
              >
                Login
              </button>

              <button
                className="rounded-xl py-3 text-lg font-semibold text-white transition hover:opacity-90"
                style={{
                  backgroundColor:
                    settings.theme_color,
                }}
              >
                Cart (0)
              </button>

            </nav>

          </div>

        )}

      </Container>

    </header>

  );
}