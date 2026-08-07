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

export default function MobileBottomNav() {

  const pathname =
    usePathname();

  const router =
    useRouter();

  const {
  isOpen,
  openCart,
  cartCount,
} = useCart();

const [user, setUser] =
  useState<any>(null);

  const [showNav, setShowNav] =
    useState(true);

  const lastScrollY =
    useRef(0);

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

  useEffect(() => {

  async function loadUser() {

    const currentUser =
      await getCurrentUser();

    setUser(currentUser);

  }

  loadUser();

}, []);

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

  async function openCartDrawer() {

  const currentUser =
    user ||
    await getCurrentUser();

  if (!currentUser) {

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

  const menus = [

    {
      title: "Home",
      href: "/",
      icon: FiHome,
    },

    {
      title: "Products",
      href: "/products",
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

  return (

  <div
    className={`fixed bottom-0 left-0 right-0 z-[999] transition-transform duration-300 lg:hidden ${
      showNav && !isOpen
        ? "translate-y-0"
        : "translate-y-full"
    }`}
  >

    <div className="mx-2 mb-2 rounded-2xl border border-[#E8E1CE] bg-white shadow-2xl">

      <div className="grid grid-cols-5">

        {menus.map((menu) => {

          const Icon =
            menu.icon;

          const active =
            pathname === menu.href ||
            (
              menu.href !== "/" &&
              pathname.startsWith(menu.href)
            );

          const handleClick = async () => {

            switch (menu.title) {

              case "Home":
                navigate("/");
                break;

              case "Products":
                navigate("/products");
                break;

              case "Search":
                navigate("/search");
                break;

              case "Cart":
                openCartDrawer();
                break;

              case "Account": {

  const currentUser =
    user ??
    await getCurrentUser();

  if (currentUser) {

    navigate("/account");

  } else {

    localStorage.setItem(
      "login-redirect",
      "account"
    );

    navigate("/login");

  }

  break;

}

            }

          };

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

              {active && (

                <span
                  className="absolute left-1/2 top-0 h-1 w-8 -translate-x-1/2 rounded-full"
                  style={{
                    backgroundColor:
                      "#98691D",
                  }}
                />

              )}

              <div className="relative">

  <Icon
    size={22}
    style={{
      color: active
        ? "#98691D"
        : "#6B7280",
    }}
  />

  {menu.title === "Cart" &&
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

              <span
                className="text-[11px] font-medium"
                style={{
                  color: active
                    ? "#98691D"
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