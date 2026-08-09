"use client";

import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import { useCart } from "@/lib/cart-context";
import { getCurrentUser } from "@/lib/auth";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FiHome,
  FiGrid,
  FiSearch,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";

import { useTheme } from "./settings.theme_color";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const router = useRouter();

  const {
    isOpen,
    openCart,
    cartCount,
  } = useCart();

  const { themeColor } = useTheme();

  const [user, setUser] =
    useState<any>(null);

  const [showNav, setShowNav] =
    useState(true);

  /*
   * Search/Product active state.
   *
   * This is stored in sessionStorage because navigating
   * to /product can remount this component.
   */
  const [activeMenu, setActiveMenu] =
    useState<string | null>(null);

  const lastScrollY =
    useRef(0);


  /* =========================================================
     SCROLL / NAV VISIBILITY
     ========================================================= */

  useEffect(() => {
    function handleScroll() {
      if (
        document.body.classList.contains(
          "product-modal-open"
        )
      ) {
        setShowNav(true);
        return;
      }

      const current =
        window.scrollY;

      if (current < 20) {
        setShowNav(true);
      } else if (
        current >
        lastScrollY.current
      ) {
        setShowNav(false);
      } else {
        setShowNav(true);
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


  /* =========================================================
     LOAD USER
     ========================================================= */

  useEffect(() => {
    async function loadUser() {
      const currentUser =
        await getCurrentUser();

      setUser(currentUser);
    }

    loadUser();
  }, []);


  /* =========================================================
     KEEP ACTIVE STATE IN SYNC WITH ROUTE
     ========================================================= */

  useEffect(() => {
    const savedActive =
      sessionStorage.getItem(
        "mobile-nav-active"
      );

    /*
     * Search is special.
     *
     * Search button uses the /product page,
     * so when saved state is Search and pathname
     * is /product, Search must remain active.
     */
    if (
      pathname === "/product" &&
      savedActive === "Search"
    ) {
      setActiveMenu("Search");
      return;
    }

    /*
     * If Product was selected, keep Product active.
     */
    if (
      pathname === "/product" &&
      savedActive === "Product"
    ) {
      setActiveMenu("Product");
      return;
    }

    /*
     * Normal pathname based routes.
     */
    if (pathname === "/") {
      setActiveMenu("Home");
      return;
    }

    if (
      pathname.startsWith("/account") ||
      pathname === "/login"
    ) {
      setActiveMenu("Account");
      return;
    }

    /*
     * For other pages, don't force Search/Product.
     */
    if (pathname !== "/product") {
      sessionStorage.removeItem(
        "mobile-nav-active"
      );

      setActiveMenu(null);
    }
  }, [pathname]);


  /* =========================================================
     SET ACTIVE MENU
     ========================================================= */

  function setActiveNavigation(
    menu: string | null
  ) {
    setActiveMenu(menu);

    if (menu) {
      sessionStorage.setItem(
        "mobile-nav-active",
        menu
      );
    } else {
      sessionStorage.removeItem(
        "mobile-nav-active"
      );
    }
  }


  /* =========================================================
     CLOSE PRODUCT MODAL
     ========================================================= */

  function closeModal() {
    if (
      document.body.classList.contains(
        "product-modal-open"
      )
    ) {
      if (
        window.history.state
          ?.productModal
      ) {
        window.history.back();
      }

      return true;
    }

    return false;
  }


  /* =========================================================
     NAVIGATION
     ========================================================= */

  function navigate(
    href: string
  ) {
    const closed =
      closeModal();

    if (closed) {
      setTimeout(() => {
        router.push(href);
      }, 180);

      return;
    }

    router.push(href);
  }


  /* =========================================================
     CART DRAWER
     ========================================================= */

  async function openCartDrawer() {
    const currentUser =
      user ||
      await getCurrentUser();

    if (!currentUser) {
      setActiveNavigation(null);

      navigate(
        "/login?redirect=cart"
      );

      return;
    }

    const closed =
      closeModal();

    if (closed) {
      setTimeout(() => {
        openCart();
      }, 180);

      return;
    }

    openCart();
  }


  /* =========================================================
     MENU
     ========================================================= */

  const menus = [
    {
      title: "Home",
      href: "/",
      icon: FiHome,
    },

    {
      title: "Product",
      href: "/product",
      icon: FiGrid,
    },

    {
      title: "Search",
      href: "/search",
      icon: FiSearch,
    },

    {
      title: "Cart",
      href: "#",
      icon: FiShoppingCart,
    },

    {
      title: "Account",
      href: "/login",
      icon: FiUser,
    },
  ];


  /* =========================================================
     PAGE
     ========================================================= */

  return (
    <div
      className={`
        fixed
        bottom-0
        left-0
        right-0
        z-[999]
        transition-transform
        duration-300
        lg:hidden

        ${
          showNav && !isOpen
            ? "translate-y-0"
            : "translate-y-full"
        }
      `}
    >

      <div
        className="
          mx-2
          mb-2
          rounded-2xl
          border
          bg-white
          shadow-2xl
        "
        style={{
          borderColor: "var(--theme-color-20)",
        }}
      >

        <div className="grid grid-cols-5">

          {menus.map((menu) => {
            const Icon =
              menu.icon;


            /* =================================================
               ACTIVE STATE
               ================================================= */

            const active =
              activeMenu === menu.title ||
              (
                activeMenu === null &&
                (
                  pathname === menu.href ||
                  (
                    menu.href !== "/" &&
                    pathname.startsWith(
                      menu.href
                    )
                  )
                )
              );


            /* =================================================
               CLICK
               ================================================= */

            const handleClick =
              async () => {

                switch (menu.title) {

                  /* =========================================
                     HOME
                     ========================================= */

                  case "Home": {
                    setActiveNavigation(
                      "Home"
                    );

                    navigate("/");

                    break;
                  }


                  /* =========================================
                     PRODUCT
                     ========================================= */

                  case "Product": {
                    /*
                     * Explicitly change active state
                     * before navigation.
                     */
                    setActiveNavigation(
                      "Product"
                    );

                    navigate(
                      "/product"
                    );

                    break;
                  }


                  /* =========================================
                     SEARCH
                     ========================================= */

                  case "Search": {
                    /*
                     * IMPORTANT:
                     *
                     * Save Search BEFORE navigation.
                     *
                     * When /product loads, this component
                     * can remount. sessionStorage makes sure
                     * Search remains active on the FIRST click.
                     */
                    setActiveNavigation(
                      "Search"
                    );

                    navigate(
                      "/product"
                    );

                    /*
                     * Wait for Product page/search input
                     * to render.
                     */
                    setTimeout(() => {
                      const searchInput =
                        document.querySelector<HTMLInputElement>(
                          'input[placeholder="Search products..."]'
                        );

                      if (searchInput) {
                        searchInput.scrollIntoView(
                          {
                            behavior:
                              "smooth",
                            block:
                              "center",
                          }
                        );

                        searchInput.focus();
                      }
                    }, 500);

                    break;
                  }


                  /* =========================================
                     CART
                     ========================================= */

                  case "Cart": {
                    /*
                     * Cart is an action, not a page.
                     */
                    setActiveNavigation(
                      null
                    );

                    await openCartDrawer();

                    break;
                  }


                  /* =========================================
                     ACCOUNT
                     ========================================= */

                  case "Account": {
                    const currentUser =
                      user ??
                      await getCurrentUser();

                    setActiveNavigation(
                      "Account"
                    );

                    if (currentUser) {
                      navigate(
                        "/account"
                      );
                    } else {
                      localStorage.setItem(
                        "login-redirect",
                        "account"
                      );

                      navigate(
                        "/login"
                      );
                    }

                    break;
                  }

                }
              };


            /* =================================================
               BUTTON
               ================================================= */

            return (
              <button
                key={menu.title}
                id={
                  menu.title === "Cart"
                    ? "bottom-cart"
                    : undefined
                }
                onClick={handleClick}
                className="
                  relative
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-1
                  py-3
                  transition-all
                  duration-300
                "
              >

                {/* ===========================================
                   ACTIVE INDICATOR
                   =========================================== */}

                {active && (
                  <span
                    className="
                      absolute
                      left-1/2
                      top-0
                      h-1
                      w-8
                      -translate-x-1/2
                      rounded-full
                    "
                    style={{
                      backgroundColor:
                        themeColor,
                    }}
                  />
                )}


                {/* ===========================================
                   ICON
                   =========================================== */}

                <div className="relative">

                  <Icon
                    size={22}
                    style={{
                      color: active
                        ? themeColor
                        : "#6B7280",
                    }}
                  />


                  {/* Cart Count */}
                  {menu.title ===
                    "Cart" &&
                    cartCount > 0 && (
                      <span
                        className="
                          absolute
                          -right-2
                          -top-2
                          flex
                          h-5
                          min-w-[20px]
                          items-center
                          justify-center
                          rounded-full
                          bg-red-600
                          px-1
                          text-[10px]
                          font-bold
                          text-white
                        "
                      >
                        {cartCount > 99
                          ? "99+"
                          : cartCount}
                      </span>
                    )}

                </div>


                {/* ===========================================
                   LABEL
                   =========================================== */}

                <span
                  className="
                    text-[11px]
                    font-medium
                  "
                  style={{
                    color: active
                      ? themeColor
                      : "#6B7280",
                  }}
                >
                  {menu.title}
                </span>

              </button>
            );
          })}

        </div>
      </div>
    </div>
  );
}