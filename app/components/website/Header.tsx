"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import {
  Menu,
  X,
  Search,
  Heart,
  ShoppingBag,
} from "lucide-react";

import Container from "./Container";
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

import {
  getHeaderSettings,
} from "@/lib/header";


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
  } = useTheme();


  /*
   * =====================================================
   * HEADER SETTINGS
   * Load logo directly from database
   * =====================================================
   */

  const [headerSettings, setHeaderSettings] =
    useState<HeaderSettings>({
      website_name: "SutoCraft",
      logo_url: "",
      theme_color: "#98691D",
    });


  /*
   * =====================================================
   * USER STATE
   * =====================================================
   */

  const [user, setUser] =
    useState<any>(null);

  const [profile, setProfile] =
    useState<any>(null);


  /*
   * =====================================================
   * MOBILE MENU
   * =====================================================
   */

  const [menuOpen, setMenuOpen] =
    useState(false);


  /*
   * =====================================================
   * HEADER SCROLL
   * =====================================================
   */

  const [showHeader, setShowHeader] =
    useState(true);

  const [isScrolled, setIsScrolled] =
    useState(false);

  const lastScrollY =
    useRef(0);


  /*
   * =====================================================
   * LOAD HEADER SETTINGS
   * =====================================================
   */

  useEffect(() => {

    async function loadHeaderSettings() {

      try {

        const settings =
          await getHeaderSettings();


        setHeaderSettings({
          website_name:
            settings.website_name ||
            "SutoCraft",

          logo_url:
            settings.logo_url ||
            "",

          theme_color:
            settings.theme_color ||
            "#98691D",
        });

      } catch (error) {

        console.error(
          "Header settings error:",
          error
        );

      }

    }


    loadHeaderSettings();

  }, []);


  /*
   * =====================================================
   * LOGIN / CART CHECK
   * =====================================================
   */

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


  /*
   * =====================================================
   * AUTO OPEN CART AFTER LOGIN
   * =====================================================
   */

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


  /*
   * =====================================================
   * HEADER SCROLL BEHAVIOR
   * =====================================================
   */

  useEffect(() => {

    function handleScroll() {

      const current =
        window.scrollY;


      setIsScrolled(
        current > 10
      );


      if (current < 20) {

        setShowHeader(true);

      } else if (
        current >
        lastScrollY.current
      ) {

        setShowHeader(false);

      } else {

        setShowHeader(true);

      }


      lastScrollY.current =
        current;

    }


    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );


    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );

  }, []);


  /*
   * =====================================================
   * CHECK LOGIN
   * =====================================================
   */

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


  /*
   * =====================================================
   * CART CLICK
   * =====================================================
   */

  async function handleCartClick() {

    const currentUser =
      await getCurrentUser();


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

  }


  /*
   * =====================================================
   * LOGOUT
   * =====================================================
   */

  async function handleLogout() {

    await logoutCustomer();


    setUser(null);

    setProfile(null);


    window.location.href =
      "/";

  }


  /*
   * =====================================================
   * LOGO DATA
   * =====================================================
   */

  const currentLogo =
    headerSettings.logo_url;

  const currentWebsiteName =
    headerSettings.website_name ||
    websiteName ||
    "SutoCraft";


  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (

    <header
      className={`
        sticky
        top-0
        z-50
        transition-all
        duration-300

        ${
          showHeader
            ? "translate-y-0"
            : "-translate-y-full"
        }
      `}
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

        <div
          className="
            flex
            h-[66px]
            items-center
            justify-between

            lg:h-[76px]
          "
        >

          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            href="/"
            className="
              flex
              shrink-0
              items-center
              gap-3
            "
          >

            {currentLogo ? (

              <img
                src={currentLogo}
                alt={currentWebsiteName}

                className="
                  h-10
                  w-auto
                  max-w-[180px]
                  object-contain

                  sm:h-11
                  sm:max-w-[200px]

                  lg:h-12
                  lg:max-w-[220px]
                "

                onError={(e) => {

                  /*
                   * If database URL fails,
                   * hide broken image.
                   */

                  e.currentTarget.style.display =
                    "none";

                }}
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
                  color:
                    themeColor,
                }}
              >

                {currentWebsiteName}

              </span>

            )}

          </Link>


          {/* =================================================
              DESKTOP MENU
          ================================================= */}

          <nav
            className="
              hidden
              items-center
              gap-8

              xl:gap-10

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
                px-5
                py-3
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


          {/* =================================================
              DESKTOP ACTIONS
          ================================================= */}

          <div
            className="
              hidden
              items-center
              gap-2

              lg:flex
            "
          >

            {/* SEARCH */}

            <button
              type="button"
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                transition
              "
              style={{
                borderColor:
                  `${themeColor}30`,

                color:
                  themeColor,
              }}
            >

              <Search size={20} />

            </button>


            {/* WISHLIST */}

            <Link
              href="/wishlist"
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                transition
              "
              style={{
                borderColor:
                  `${themeColor}30`,

                color:
                  themeColor,
              }}
            >

              <Heart size={20} />

            </Link>


            {/* CART */}

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
                hover:scale-105
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


            {/* LOGIN / USER */}

            {user ? (

              <UserMenu
                profile={profile}
                onLogout={
                  handleLogout
                }
              />

            ) : (

              <Link
                href="/login"

                className="
                  rounded-xl
                  border
                  px-6
                  py-3
                  font-semibold
                  transition-all
                  duration-300
                  hover:text-white
                "

                style={{
                  borderColor:
                    themeColor,

                  color:
                    themeColor,
                }}

                onMouseEnter={(e) => {

                  e.currentTarget.style.backgroundColor =
                    themeColor;

                  e.currentTarget.style.color =
                    "#ffffff";

                }}

                onMouseLeave={(e) => {

                  e.currentTarget.style.backgroundColor =
                    "transparent";

                  e.currentTarget.style.color =
                    themeColor;

                }}
              >

                Login

              </Link>

            )}

          </div>


          {/* =================================================
              MOBILE ACTIONS
          ================================================= */}

          <div
            className="
              flex
              items-center
              gap-2

              lg:hidden
            "
          >

            {/* MOBILE CART */}

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
                  "
                >

                  {cartCount}

                </span>

              )}

            </button>


            {/* MOBILE MENU */}

            <button
              type="button"

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


        {/* =================================================
            MOBILE MENU
        ================================================= */}

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
                  type="button"

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