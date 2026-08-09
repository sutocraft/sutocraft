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

      const {
        data: categoryData,
        error: categoryError,
      } = await supabase
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
       * Subcategories are taken from active products.
       * This keeps the existing database relationship.
       */
      const {
        data: productRelations,
        error: relationError,
      } = await supabase
        .from("products")
        .select(
          "category_id,sub_category:sub_categories(id,name)"
        )
        .eq("active", true);

      if (relationError) {
        console.error(relationError);
        return;
      }

      const grouped: Record<
        string,
        HeaderSubCategory[]
      > = {};

      for (const row of productRelations ?? []) {
        const categoryId =
          row.category_id as string | null;

        const subCategory =
          row.sub_category as
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

        if (
          !grouped[categoryId].some(
            (sub) => sub.id === item.id
          )
        ) {
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

  /* =========================================================
     LOGIN / CART
     ========================================================= */

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

  /* =========================================================
     AUTO OPEN CART AFTER LOGIN
     ========================================================= */

  useEffect(() => {
    async function autoOpenCart() {
      const pending =
        localStorage.getItem(
          "open-cart-after-login"
        );

      if (!pending) return;

      const currentUser =
        await getCurrentUser();

      if (!currentUser) return;

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

  /* =========================================================
     HEADER SCROLL
     ========================================================= */

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(
        window.scrollY > 10
      );
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
      className="
        sticky
        top-0
        z-50
        w-full
        bg-white
        transition-all
        duration-300
      "
      style={{
        backdropFilter:
          "blur(16px)",

        borderBottom:
          isScrolled
            ? "1px solid #ECE5D6"
            : "1px solid transparent",
      }}
    >
      <Container>

        {/* =====================================================
            MAIN HEADER ROW
            ===================================================== */}

        <div
          className={`
            relative
            flex
            items-center
            justify-between
            transition-all
            duration-300

            h-[62px]
            sm:h-[66px]

            ${
              isScrolled
                ? "lg:h-[56px]"
                : "lg:h-[70px]"
            }
          `}
        >

          {/* ===================================================
              LOGO
              =================================================== */}

          <Link
            href="/"
            className="
              flex
              shrink-0
              items-center
            "
          >
            {!themeLoading &&
            logoUrl?.trim() ? (
              <img
                src={logoUrl}
                alt={websiteName}
                className={`
                  h-11
                  w-auto
                  max-w-[220px]
                  object-contain
                  transition-all
                  duration-300

                  ${
                    isScrolled
                      ? "lg:h-10"
                      : "lg:h-12"
                  }
                `}
              />
            ) : (
              <span
                className="
                  text-2xl
                  font-extrabold
                  tracking-tight
                  lg:text-3xl
                "
                style={{
                  color: themeColor,
                }}
              >
                {websiteName}
              </span>
            )}
          </Link>


          {/* ===================================================
              DESKTOP MAIN MENU
              =================================================== */}

          <nav
  className="
    hidden
    items-center
    gap-7
    xl:gap-9
    lg:flex
  "
>

            <Link
              href="/"
              className="
                font-semibold
                text-[#2B2B2B]
                transition
              "
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
              onClick={() =>
                setMenuOpen(false)
              }
              className="
                px-3
                py-2
                font-semibold
                text-[#2B2B2B]
                transition
              "
            >
              Shop
            </Link>

            <Link
              href="/about"
              className="
                font-semibold
                text-[#2B2B2B]
                transition
              "
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
              className="
                font-semibold
                text-[#2B2B2B]
                transition
              "
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


          {/* ===================================================
              DESKTOP ACTIONS
              =================================================== */}

          <div
            className="
              hidden
              items-center
              gap-1.5
              lg:flex
            "
          >

            {/* Search */}

            <button
              className={`
                ${
                  isScrolled
                    ? "hidden"
                    : "flex"
                }

                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                border
                transition
              `}
              style={{
                borderColor:
                  `${themeColor}30`,
                color:
                  themeColor,
              }}
            >
              <Search size={20} />
            </button>


            {/* Wishlist */}

            <Link
              href="/wishlist"
              className={`
                ${
                  isScrolled
                    ? "hidden"
                    : "flex"
                }

                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                border
                transition
              `}
              style={{
                borderColor:
                  `${themeColor}30`,
                color:
                  themeColor,
              }}
            >
              <Heart size={20} />
            </Link>


            {/* Cart */}

            <button
              id="header-cart"
              onClick={
                handleCartClick
              }
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
                backgroundColor:
                  themeColor,

                transform:
                  "translateZ(0)",
              }}
            >
              <ShoppingBag
                size={18}
              />

              <span>
                Cart
              </span>

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
                    backgroundColor:
                      "#FF214F",

                    transform:
                      "translateZ(0)",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>


            {/* User */}

            {user ? (
              <div
                className={
                  isScrolled
                    ? "hidden"
                    : "block"
                }
              >
                <UserMenu
                  profile={profile}
                  onLogout={
                    handleLogout
                  }
                />
              </div>
            ) : (
              <Link
                href="/login"
                className={`
                  ${
                    isScrolled
                      ? "hidden"
                      : "inline-flex"
                  }

                  rounded-lg
                  border
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  transition-all
                  duration-300
                  hover:text-white
                `}
                style={{
                  borderColor:
                    themeColor,
                  color:
                    themeColor,
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


          {/* ===================================================
              MOBILE ACTIONS
              =================================================== */}

          <div
            className="
              flex
              items-center
              gap-2
              lg:hidden
            "
          >

            <button
              id="header-cart-mobile"
              data-cart-target="true"
              onClick={
                handleCartClick
              }
              className="
                relative
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                text-white
              "
              style={{
                backgroundColor:
                  themeColor,
              }}
            >
              <ShoppingBag
                size={20}
              />

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
                    transform:
                      "translateZ(0)",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>


            <button
              onClick={() =>
                setMenuOpen(
                  !menuOpen
                )
              }
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
              "
              style={{
                borderColor:
                  themeColor,
                color:
                  themeColor,
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
            ===================================================== */}

        <div
          className="
            hidden
            w-full
            border-t
            border-[#F0E9DC]
            lg:block
          "
        >

          {/*
            IMPORTANT:
            The category navigation uses the same left edge
            as the logo because both are inside the same
            Container.

            It is NOT centered anymore.

            When categories become too many, flex-wrap creates
            another line automatically.
          */}

          <div
            className="
              flex
              w-full
              min-w-0
              items-start
              gap-3
              py-0.5
            "
          >

            {/* =================================================
                CATEGORY AREA
                ================================================= */}

            <nav
              className="
                min-w-0
                flex-1
                flex
                flex-wrap
                items-center
                justify-start
                content-start
                gap-x-1
                gap-y-0
                overflow-visible
              "
              onMouseLeave={() =>
                setOpenCategoryId(
                  null
                )
              }
            >

              {categoryLoading ? (

                <div
                  className="
                    flex
                    h-10
                    w-full
                    items-center
                    justify-start
                    px-3
                    text-xs
                    font-medium
                    text-gray-400
                  "
                >
                  Loading categories...
                </div>

              ) : categories.length > 0 ? (

                categories.map(
                  (category) => {

                    const subCategories =
                      subCategoriesByCategory[
                        category.id
                      ] ?? [];

                    const hasDropdown =
                      subCategories.length >
                      0;

                    const isOpen =
                      openCategoryId ===
                      category.id;

                    return (
                      <div
                        key={
                          category.id
                        }
                        className="
                          relative
                          shrink-0
                        "
                        onMouseEnter={() =>
                          setOpenCategoryId(
                            hasDropdown
                              ? category.id
                              : null
                          )
                        }
                      >

                        {/* ===============================
                            CATEGORY LINK
                            =============================== */}

                        <Link
                          href={`/product?category=${encodeURIComponent(
                            category.slug ||
                              category.name
                          )}`}
                          className={`
                            group
                            flex
                            items-center
                            gap-1.5
                            whitespace-nowrap
                            font-semibold
                            text-[#2B2B2B]
                            transition-colors
                            duration-200

                            ${
                              isScrolled
                                ? `
                                  h-9
                                  px-2
                                  text-[11px]
                                `
                                : `
                                  h-10
                                  px-3
                                  text-[13px]
                                `
                            }
                          `}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color =
                              themeColor;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color =
                              "#2B2B2B";
                          }}
                        >

                          <span>
                            {category.name}
                          </span>

                          {hasDropdown && (
                            <ChevronDown
                              size={13}
                              className={`
                                transition-transform
                                duration-200

                                ${
                                  isOpen
                                    ? "rotate-180"
                                    : ""
                                }
                              `}
                            />
                          )}

                        </Link>


                        {/* ===============================
                            DROPDOWN
                            =============================== */}

                        {hasDropdown &&
                          isOpen && (
                            <div
                              className="
                                absolute
                                left-0
                                top-full
                                z-[80]
                                w-56
                                rounded-b-xl
                                border
                                border-[#E8E1CE]
                                bg-white
                                p-1.5
                                shadow-lg
                              "
                              onMouseEnter={() =>
                                setOpenCategoryId(
                                  category.id
                                )
                              }
                            >

                              <Link
                                href={`/product?category=${encodeURIComponent(
                                  category.slug ||
                                    category.name
                                )}`}
                                className="
                                  mb-1
                                  flex
                                  items-center
                                  rounded-lg
                                  px-3
                                  py-2
                                  text-[12px]
                                  font-bold
                                  text-[#2B2B2B]
                                  transition-colors
                                  hover:bg-[#FAF7F0]
                                "
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color =
                                    themeColor;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color =
                                    "#2B2B2B";
                                }}
                              >
                                View All{" "}
                                {category.name}
                              </Link>


                              {subCategories.map(
                                (
                                  subCategory
                                ) => (
                                  <Link
                                    key={
                                      subCategory.id
                                    }
                                    href={`/product?category=${encodeURIComponent(
                                      category.slug ||
                                        category.name
                                    )}&subcategory=${encodeURIComponent(
                                      subCategory.name
                                    )}`}
                                    className="
                                      flex
                                      items-center
                                      rounded-lg
                                      px-3
                                      py-2
                                      text-[12px]
                                      font-medium
                                      text-gray-600
                                      transition-colors
                                      hover:bg-[#FAF7F0]
                                    "
                                    onMouseEnter={(
                                      e
                                    ) => {
                                      e.currentTarget.style.color =
                                        themeColor;
                                    }}
                                    onMouseLeave={(
                                      e
                                    ) => {
                                      e.currentTarget.style.color =
                                        "#4B5563";
                                    }}
                                  >
                                    {
                                      subCategory.name
                                    }
                                  </Link>
                                )
                              )}

                            </div>
                          )}

                      </div>
                    );
                  }
                )

              ) : (

                <Link
                  href="/product"
                  className={`
                    flex
                    items-center
                    px-3
                    font-semibold
                    text-[#2B2B2B]

                    ${
                      isScrolled
                        ? `
                          h-9
                          text-[11px]
                        `
                        : `
                          h-10
                          text-[13px]
                        `
                    }
                  `}
                >
                  Shop All Products
                </Link>

              )}

            </nav>


            {/* =================================================
                WHATSAPP
                ================================================= */}

            {!isScrolled && (
              <a
                href="https://wa.me/8801616964247"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="
                  group
                  flex
                  shrink-0
                  items-center
                  gap-2
                  px-1
                  py-2
                  pr-1
                "
              >

                <svg
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  className="
                    h-5
                    w-5
                    shrink-0
                    transition-transform
                    duration-200
                    group-hover:scale-105
                  "
                >

                  <path
                    fill="#25D366"
                    d="M16 2.5C8.54 2.5 2.5 8.54 2.5 16c0 2.38.62 4.72 1.8 6.77L2.5 29.5l6.92-1.76A13.43 13.43 0 0 0 16 29.5c7.46 0 13.5-6.04 13.5-13.5S23.46 2.5 16 2.5Z"
                  />

                  <path
                    fill="#fff"
                    d="M22.86 18.87c-.3-.15-1.78-.88-2.05-.98-.28-.1-.48-.15-.69.15-.2.3-.79.98-.96 1.18-.18.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.69-1.65-.94-2.26-.25-.59-.5-.51-.69-.52h-.58c-.2 0-.53.08-.81.38-.28.3-1.06 1.04-1.06 2.54s1.09 2.95 1.24 3.15c.15.2 2.14 3.27 5.18 4.58.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z"
                  />

                </svg>


                <div
                  className="
                    whitespace-nowrap
                    leading-tight
                  "
                >

                  <div
                    className="
                      text-[11px]
                      font-medium
                      text-gray-500
                    "
                  >
                    WhatsApp
                  </div>

                  <span
                    className="
                      text-[12px]
                      font-semibold
                      tracking-wide
                      text-[#2B2B2B]
                      transition-colors
                      duration-200
                      group-hover:text-[#25D366]
                    "
                  >
                    +880 1616-964247
                  </span>

                </div>

              </a>
            )}

          </div>

        </div>


        {/* =====================================================
            MOBILE MENU
            ===================================================== */}

        {menuOpen && (

          <div
            className="
              border-t
              border-[#ECE4D5]
              bg-white
              lg:hidden
            "
          >

            <nav
              className="
                flex
                flex-col
                py-3
              "
            >

              <Link
                href="/"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="
                  px-5
                  py-3
                  font-semibold
                  text-[#2B2B2B]
                  transition
                "
              >
                Home
              </Link>

              <Link
                href="/product"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="
                  px-5
                  py-3
                  font-semibold
                  text-[#2B2B2B]
                  transition
                "
              >
                Shop
              </Link>

              <Link
                href="/about"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="
                  px-5
                  py-3
                  font-semibold
                  text-[#2B2B2B]
                  transition
                "
              >
                About
              </Link>

              <Link
                href="/contact"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="
                  px-5
                  py-3
                  font-semibold
                  text-[#2B2B2B]
                  transition
                "
              >
                Contact
              </Link>

              <Link
                href="/wishlist"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="
                  px-5
                  py-3
                  font-semibold
                  text-[#2B2B2B]
                  transition
                "
              >
                Wishlist
              </Link>

              {user ? (

                <button
                  onClick={
                    handleLogout
                  }
                  className="
                    mx-5
                    mt-4
                    rounded-xl
                    py-3
                    font-semibold
                    text-white
                    transition
                  "
                  style={{
                    backgroundColor:
                      themeColor,
                  }}
                >
                  Logout
                </button>

              ) : (

                <Link
                  href="/login"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="
                    mx-5
                    mt-4
                    rounded-xl
                    py-3
                    text-center
                    font-semibold
                    text-white
                    transition
                  "
                  style={{
                    backgroundColor:
                      themeColor,
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