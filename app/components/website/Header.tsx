"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCurrentUser,
  getCurrentUserProfile,
  logoutCustomer,
} from "@/lib/auth";

import UserMenu from "./UserMenu";

import Image from "next/image";
import Container from "./Container";
import { getHeaderSettings } from "@/lib/header";
import { getCartCount } from "@/lib/cart";
import { useCart } from "@/lib/cart-context";
import { useTheme } from "@/app/components/website/settings.theme_color";

type HeaderSettings = {
  website_name: string;
  logo_url: string;
  theme_color: string;
};

export default function Header() {

  const [user, setUser] = useState<any>(null);
const [profile, setProfile] = useState<any>(null);
const {
  openCart,
  cartCount,
  setCartCount,
} = useCart();

const {
  themeColor,
  websiteName,
  logoUrl,
} = useTheme();

  useEffect(() => {
  checkLogin();

  const interval = setInterval(checkLogin, 1000);

  return () => clearInterval(interval);
}, []);

  async function checkLogin() {
  const currentUser = await getCurrentUser();

  setUser(currentUser);

  if (currentUser) {
    const p = await getCurrentUserProfile();
    setProfile(p);

    const count = await getCartCount();
    setCartCount(count);

  } else {

    setProfile(null);
    setCartCount(0);

  }
}

  const [menuOpen, setMenuOpen] = useState(false);

  // ThemeProvider handles website settings.
// No local header settings state needed.

  async function handleLogout() {
  await logoutCustomer();

  setUser(null);
  setProfile(null);

  window.location.href = "/";
}
  
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

            {logoUrl ? (

              <Image
                src={logoUrl}
                alt={websiteName}
                width={180}
                height={60}
                className="h-12 w-auto object-contain"
                priority
              />

            ) : (

              <span
                className="text-3xl font-bold tracking-tight lg:text-5xl"
                style={{
                  color: themeColor,
                }}
              >
                {websiteName}
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

            {user ? (

  <UserMenu
    profile={profile}
    onLogout={handleLogout}
  />

) : (

  <Link
    href="/login"
    className="rounded-xl border px-6 py-3 font-semibold transition hover:text-white"
    style={{
  borderColor: themeColor,
  color: themeColor,
}}
onMouseEnter={(e) => {
  e.currentTarget.style.backgroundColor =
    themeColor;
}}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor =
        "transparent";
    }}
  >
    Login
  </Link>

)}

         <button
  id="header-cart"
  onClick={openCart}
  className="px-5 py-3 rounded-lg text-white transition-all duration-200 hover:scale-105"
style={{
  backgroundColor: themeColor,
}}
>
  Cart ({cartCount})
</button>   

          </div>

          {/* Mobile Menu Button */}

          <button
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            className="flex h-11 w-11 items-center justify-center rounded-xl border-2 text-2xl font-bold lg:hidden"
            style={{
  borderColor: themeColor,
  color: themeColor,
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

              <Link
  href={user ? "/account" : "/login"}
>
    <button className="rounded-lg bg-amber-600 px-5 py-2 text-white hover:bg-amber-700">
        {user ? "My Account" : "Login"}
    </button>
</Link>

              <button
  id="header-cart"
  onClick={openCart}
  className="bg-[#98691D] text-white px-5 py-3 rounded-lg"
>
  Cart ({cartCount})
</button>   

            </nav>

          </div>

        )}

      </Container>

    </header>

  );
}