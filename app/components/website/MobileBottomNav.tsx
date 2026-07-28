"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiGrid,
  FiSearch,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";

export default function MobileBottomNav() {
  const pathname = usePathname();

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
      href: "/cart",
      icon: FiShoppingCart,
    },
    {
      title: "Account",
      href: "/login",
      icon: FiUser,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] lg:hidden">
      <div className="mx-3 mb-3 rounded-2xl border border-[#E8E1CE] bg-white shadow-2xl">

        <div className="grid grid-cols-5">

          {menus.map((menu) => {
            const Icon = menu.icon;

            const active =
              pathname === menu.href ||
              (menu.href !== "/" && pathname.startsWith(menu.href));

            return (
              <Link
                key={menu.title}
                href={menu.href}
                className="relative flex flex-col items-center justify-center gap-1 py-3"
              >
                {active && (
                  <span className="absolute left-1/2 top-0 h-1 w-8 -translate-x-1/2 rounded-full bg-[#98691D]" />
                )}

                <Icon
                  size={22}
                  className={
                    active
                      ? "text-[#98691D]"
                      : "text-gray-500"
                  }
                />

                <span
                  className={`text-[11px] font-medium ${
                    active
                      ? "text-[#98691D]"
                      : "text-gray-500"
                  }`}
                >
                  {menu.title}
                </span>
              </Link>
            );
          })}

        </div>

      </div>
    </div>
  );
}