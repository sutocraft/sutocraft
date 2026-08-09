"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  Menu,
  X,
  Search,
  ChevronDown,
  Heart,
  ShoppingBag,
} from "lucide-react";

import Container from "./Container";
import { supabase } from "@/lib/supabase";
import UserMenu from "./UserMenu";

import {
  getCurrentUser,
  getCurrentUserProfile,
  logoutCustomer,
} from "@/lib/auth";

import {
  getCartCount,
} from "@/lib/cart";

import {
  useCart,
} from "@/lib/cart-context";

import {
  useTheme,
} from "@/app/components/website/settings.theme_color";

type HeaderSettings = {
  website_name: string;
  logo_url: string;
  theme_color: string;
};

export default function Header() {

  const {
    openCart,
    cartCount,
    setCartCount,
  } = useCart();

  const {
    themeColor,
    websiteName,
    logoUrl,
    loading: themeLoading,
  } = useTheme();

  const [user, setUser] =
    useState<any>(null);

  const [profile, setProfile] =
    useState<any>(null);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [isScrolled, setIsScrolled] =
    useState(false);

  /* =========================================================
     DESKTOP CATEGORY NAVIGATION
     ========================================================= */

  type HeaderCategory = {
    id: string;
    name: string;
    slug: string;
  };

  type HeaderSubCategory = {
    id: string;
    name: string;
  };

  const [categories, setCategories] =
    useState<HeaderCategory[]>([]);

  const [subCategoriesByCategory, setSubCategoriesByCategory] =
    useState<Record<string, HeaderSubCategory[]>>({});

  const [openCategoryId, setOpenCategoryId] =
    useState<string | null>(null);

  const [categoryLoading, setCategoryLoading] =
    useState(true);

  useEffect(() => {
    loadHeaderCategories();
  }, []);

  async function loadHeaderCategories() {
    try {
      setCategoryLoading(true);

      const { data: categoryData, error: categoryError } =
        await supabase
          .from("categories")
          .select("id,name,slug")
          .order("name", { ascending: true });

      if (categoryError) {
        console.error(categoryError);
        return;
      }

      const loadedCategories =
        (categoryData ?? []) as HeaderCategory[];

      setCategories(loadedCategories);

      /*
       * The current sub_categories table stores the subcategory
       * name/id, while products carry both category_id and
       * sub_category_id. We therefore build the relationship
       * safely from active products instead of assuming a
       * category_id column exists on sub_categories.
       */
      const { data: productRelations, error: relationError } =
        await supabase
          .from("products")
          .select("category_id,sub_category:sub_categories(id,name)")
          .eq("active", true);

      if (relationError) {
        console.error(relationError);
        return;
      }

      const grouped: Record<string, HeaderSubCategory[]> = {};

      for (const row of productRelations ?? []) {
        const categoryId = row.category_id as string | null;
        const subCategory = row.sub_category as
          | HeaderSubCategory
          | HeaderSubCategory[]
          | null;

        if (!categoryId || !subCategory) continue;

        const item = Array.isArray(subCategory)
          ? subCategory[0]
          : subCategory;

        if (!item?.id || !item?.name) continue;

        if (!grouped[categoryId]) {
          grouped[categoryId] = [];
        }

        if (!grouped[categoryId].some((sub) => sub.id === item.id)) {
          grouped[categoryId].push({
            id: item.id,
            name: item.name,
          });
        }
      }

      Object.values(grouped).forEach((items) => {
        items.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      });

      setSubCategoriesByCategory(grouped);
    } catch (error) {
      console.error(error);
    } finally {
      setCategoryLoading(false);
    }
  }

  useEffect(() => {
    checkLogin();

    const interval =
      setInterval(
        checkLogin,
        1000
      );

    return () =>
      clearInterval(interval);
  }, []);

  useEffect(() => {

  async function autoOpenCart() {

    const pending =
      localStorage.getItem(
        "open-cart-after-login"
      );

    if (!pending) return;

    const user =
      await getCurrentUser();

    if (!user) return;

    localStorage.removeItem(
      "open-cart-after-login"
    );

    requestAnimationFrame(() => {

  setTimeout(() => {

    openCart();

  }, 150);

});

  }

  autoOpenCart();

}, []);

  useEffect(() => {

    function handleScroll() {
      setIsScrolled(window.scrollY > 10);
    }

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );

  }, []);

  async function checkLogin() {

    const currentUser =
      await getCurrentUser();

    setUser(currentUser);

    if (currentUser) {

      const p =
        await getCurrentUserProfile();

      setProfile(p);

      const count =
        await getCartCount();

      setCartCount(count);

    } else {

      setProfile(null);

      setCartCount(0);

    }

  }

  async function handleCartClick() {
    const currentUser =
      user || await getCurrentUser();

    if (!currentUser) {
      localStorage.setItem(
        "login-redirect",
        "cart"
      );

      window.location.href =
        "/login";

      return;
    }

    openCart();

    window.dispatchEvent(
      new Event("open-cart")
    );
  }

  async function handleLogout() {

    await logoutCustomer();

    setUser(null);

    setProfile(null);

    window.location.href =
      "/";

  }

  return (

    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: "#ffffff",
        backdropFilter:
          "blur(16px)",
        borderBottom:
          isScrolled
            ? "1px solid #ECE5D6"
            : "1px solid transparent",
      }}
    >

      <Container>

        <div className="flex h-[62px] items-center justify-between sm:h-[66px] lg:h-[70px]">

                    {/* ===========================
              Logo
          =========================== */}

          <Link
            href="/"
            className="flex shrink-0 items-center"
          >
            {!themeLoading && logoUrl?.trim() ? (
              <img
                src={logoUrl}
                alt={websiteName}
                className="h-11 w-auto max-w-[220px] object-contain lg:h-12"
              />
            ) : (
              <span
                className="text-2xl font-extrabold tracking-tight lg:text-3xl"
                style={{
                  color: themeColor,
                }}
              >
                {websiteName}
              </span>
            )}
          </Link>

          {/* ===========================
              Desktop Menu
          =========================== */}

          <nav className="hidden items-center gap-7 xl:gap-9 lg:flex">

            <Link
              href="/"
              className="font-semibold text-[#2B2B2B] transition"
              style={{
                color: "#2B2B2B",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color =
                  themeColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  "#2B2B2B")
              }
            >
              Home
            </Link>

            <Link
  href="/product"
  onClick={() => setMenuOpen(false)}
  className="px-3 py-2 font-semibold text-[#2B2B2B] transition"
>
  Shop
</Link>

            <Link
              href="/about"
              className="font-semibold text-[#2B2B2B] transition"
              onMouseEnter={(e) =>
                (e.currentTarget.style.color =
                  themeColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  "#2B2B2B")
              }
            >
              About
            </Link>

            <Link
              href="/contact"
              className="font-semibold text-[#2B2B2B] transition"
              onMouseEnter={(e) =>
                (e.currentTarget.style.color =
                  themeColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  "#2B2B2B")
              }
            >
              Contact
            </Link>

          </nav>

          {/* ===========================
              Desktop Actions
          =========================== */}

          <div className="hidden items-center gap-1.5 lg:flex">

            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg border transition"
              style={{
                borderColor: `${themeColor}30`,
                color: themeColor,
              }}
            >
              <Search size={20} />
            </button>

            <Link
              href="/wishlist"
              className="flex h-10 w-10 items-center justify-center rounded-lg border transition"
              style={{
                borderColor: `${themeColor}30`,
                color: themeColor,
              }}
            >
              <Heart size={20} />
            </Link>

                        <button
  id="header-cart"
  onClick={handleCartClick}
  className="
    relative
    flex
    h-11
    items-center
    gap-2
    rounded-xl
    px-5

    font-semibold
    text-white

    transition-all
    duration-300

    hover:-translate-y-0.5

    will-change-transform
  "
  style={{
    backgroundColor: themeColor,
    transform: "translateZ(0)",
  }}
>
              <ShoppingBag size={18} />

              <span>Cart</span>

              {cartCount > 0 && (
  <span
    id="header-cart-badge"
    className="
      absolute
      -right-2
      -top-2

      flex
      h-6
      min-w-[24px]

      items-center
      justify-center

      rounded-full

      px-1

      text-xs
      font-bold
      text-white

      shadow-xl

      will-change-transform
    "
    style={{
      backgroundColor: "#FF214F",
      transform: "translateZ(0)",
    }}
  >
    {cartCount}
  </span>
)}
            </button>

            {user ? (

              <UserMenu
                profile={profile}
                onLogout={handleLogout}
              />

            ) : (

              <Link
                href="/login"
                className="rounded-lg border px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:text-white"
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

          </div>

          {/* ===========================
              Mobile Actions
          =========================== */}

          <div className="flex items-center gap-2 lg:hidden">

            <button
  id="header-cart-mobile"
  data-cart-target="true"
              onClick={handleCartClick}
              className="relative flex h-11 w-11 items-center justify-center rounded-xl text-white"
              style={{
                backgroundColor: themeColor,
              }}
            >
              <ShoppingBag size={20} />

              {cartCount > 0 && (
  <span
    id="header-cart-mobile-badge"
    className="
      absolute
      -right-1
      -top-1

      flex
      h-5
      min-w-[20px]

      items-center
      justify-center

      rounded-full

      bg-red-500

      px-1

      text-[10px]
      font-bold
      text-white

      shadow-lg

      will-change-transform
    "
    style={{
      transform: "translateZ(0)",
    }}
  >
    {cartCount}
  </span>
)}
            </button>

            <button
              onClick={() =>
                setMenuOpen(!menuOpen)
              }
              className="flex h-11 w-11 items-center justify-center rounded-xl border"
              style={{
                borderColor: themeColor,
                color: themeColor,
              }}
            >
              {menuOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>

          </div>

        </div>

                {/* =====================================================
            DESKTOP CATEGORY NAVIGATION
            Hover opens dropdown. Mobile/tablet untouched.
           ===================================================== */}

        <div className="relative hidden border-t border-[#F0E9DC] lg:block">
          <nav
            className="flex items-center justify-center gap-0.5 overflow-visible"
            onMouseLeave={() => setOpenCategoryId(null)}
          >
            {categoryLoading ? (
              <div className="flex h-12 items-center justify-center px-4 text-xs font-medium text-gray-400">
                Loading categories...
              </div>
            ) : categories.length > 0 ? (
              categories.map((category) => {
                const subCategories =
                  subCategoriesByCategory[category.id] ?? [];

                const hasDropdown =
                  subCategories.length > 0;

                const isOpen =
                  openCategoryId === category.id;

                return (
                  <div
                    key={category.id}
                    className="relative"
                    onMouseEnter={() =>
                      setOpenCategoryId(
                        hasDropdown ? category.id : null
                      )
                    }
                  >
                    <Link
                      href={`/product?category=${encodeURIComponent(
                        category.slug || category.name
                      )}`}
                      className="group flex h-10 items-center gap-1.5 px-3 text-[11px] font-semibold whitespace-nowrap text-[#2B2B2B] transition-colors duration-200"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = themeColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#2B2B2B";
                      }}
                    >
                      <span>{category.name}</span>

                      {hasDropdown && (
                        <ChevronDown
                          size={13}
                          className={`transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </Link>

                    {hasDropdown && isOpen && (
                      <div
                        className="absolute left-1/2 top-full z-[80] w-56 -translate-x-1/2 rounded-b-xl border border-[#E8E1CE] bg-white p-1.5 shadow-lg"
                        onMouseEnter={() =>
                          setOpenCategoryId(category.id)
                        }
                      >
                        <Link
                          href={`/product?category=${encodeURIComponent(
                            category.slug || category.name
                          )}`}
                          className="mb-1 flex items-center rounded-lg px-3 py-2 text-[12px] font-bold text-[#2B2B2B] transition-colors hover:bg-[#FAF7F0]"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = themeColor;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "#2B2B2B";
                          }}
                        >
                          View All {category.name}
                        </Link>

                        {subCategories.map((subCategory) => (
                          <Link
                            key={subCategory.id}
                            href={`/product?category=${encodeURIComponent(
                              category.slug || category.name
                            )}&subcategory=${encodeURIComponent(
                              subCategory.name
                            )}`}
                            className="flex items-center rounded-lg px-3 py-2 text-[12px] font-medium text-gray-600 transition-colors hover:bg-[#FAF7F0]"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = themeColor;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = "#4B5563";
                            }}
                          >
                            {subCategory.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <Link
                href="/product"
                className="flex h-10 items-center px-4 text-[11px] font-semibold text-[#2B2B2B]"
              >
                Shop All Products
              </Link>
            )}
          </nav>
        </div>

        {/* ===========================
            Mobile Menu
        =========================== */}

        {menuOpen && (

          <div className="border-t border-[#ECE4D5] bg-white lg:hidden">

            <nav className="flex flex-col py-3">

              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="px-5 py-3 font-semibold text-[#2B2B2B] transition"
              >
                Home
              </Link>

              <Link
                href="/product"
                onClick={() => setMenuOpen(false)}
                className="px-5 py-3 font-semibold text-[#2B2B2B] transition"
              >
                Shop
              </Link>

              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="px-5 py-3 font-semibold text-[#2B2B2B] transition"
              >
                About
              </Link>

              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="px-5 py-3 font-semibold text-[#2B2B2B] transition"
              >
                Contact
              </Link>

              <Link
                href="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="px-5 py-3 font-semibold text-[#2B2B2B] transition"
              >
                Wishlist
              </Link>

              {user ? (

                <button
                  onClick={handleLogout}
                  className="mx-5 mt-4 rounded-xl py-3 font-semibold text-white transition"
                  style={{
                    backgroundColor: themeColor,
                  }}
                >
                  Logout
                </button>

              ) : (

                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="mx-5 mt-4 rounded-xl py-3 text-center font-semibold text-white transition"
                  style={{
                    backgroundColor: themeColor,
                  }}
                >
                  Login
                </Link>

              )}

            </nav>

          </div>

        )}

      </Container>

    </header>

  );

}