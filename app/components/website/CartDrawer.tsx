"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { useCart } from "@/lib/cart-context";
import {
  getCurrentUser,
} from "@/lib/auth";

import {
  getCartItems,
} from "@/lib/cart";

import CartDrawerItem from "./CartDrawerItem";
import { getHeaderSettings } from "@/lib/header";

type CartItem = {
  id: string;
  quantity: number;

  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };

  size: {
    id: string;
    name: string;
  } | null;

  color: {
    id: string;
    name: string;
    code: string;
  } | null;
};

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    setCartCount,
  } = useCart();

  const [loading, setLoading] =
    useState(true);

  const [items, setItems] =
    useState<CartItem[]>([]);

  const [themeColor, setThemeColor] =
    useState("#98691D");

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadCart();
    }
  }, [isOpen]);

  async function loadTheme() {
    const setting =
      await getHeaderSettings();

    setThemeColor(
      setting.theme_color || "#98691D"
    );
  }

  async function loadCart() {
    setLoading(true);

    const user =
      await getCurrentUser();

    if (!user) {
      setItems([]);
      setCartCount(0);
      setLoading(false);
      return;
    }

    const data =
      await getCartItems(user.id);

    setItems(data);

    setCartCount(data.length);

    setLoading(false);
  }

  const total =
    items.reduce(
      (sum, item) =>
        sum +
        item.product.price *
          item.quantity,
      0
    );

  return (
    <>
      {isOpen && (
        <>
          {/* Backdrop */}

          <div
            onClick={closeCart}
            className="fixed inset-0 z-[100] bg-black/40"
          />

          {/* Drawer */}

          <div className="fixed right-0 top-0 z-[101] flex h-screen w-[420px] max-w-full flex-col border-l bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b p-5">

              <h2 className="text-2xl font-bold text-gray-800">
                Shopping Cart
              </h2>

              <button
                onClick={closeCart}
                className="text-2xl text-gray-500"
              >
                ×
              </button>
            </div>

            {/* Body */}

            <div className="flex-1 overflow-y-auto p-4">

              {loading && (
                <div className="py-10 text-center">
                  Loading...
                </div>
              )}

              {!loading &&
                items.length === 0 && (
                  <div className="py-20 text-center text-gray-500">
                    Cart is empty.
                  </div>
                )}

              {!loading &&
                items.map((item) => (
                  <CartDrawerItem
                    key={item.id}
                    item={item}
                    reload={loadCart}
                  />
                ))}
            </div>

            {/* Footer */}

            <div className="border-t p-5">

              <div className="mb-4 flex justify-between text-lg font-bold">

                <span>Total</span>

                <span
                  style={{
                    color: themeColor,
                  }}
                >
                  ৳ {total}
                </span>
              </div>

              <button
                className="w-full rounded-xl py-4 text-lg font-semibold text-white"
                style={{
                  backgroundColor:
                    themeColor,
                }}
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}