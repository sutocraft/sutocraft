"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X,
  ShoppingBag,
} from "lucide-react";

import { useCart } from "@/lib/cart-context";

import {
  getCartItems,
  updateCartQuantity,
  removeCartItem,
} from "@/lib/cart";

import CartDrawerItem from "./CartDrawerItem";

type CartItem = any;

export default function CartDrawer() {
  const { isOpen, closeCart, cartCount, setCartCount } = useCart();

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  async function loadCart() {
    try {
      setLoading(true);

      const data = await getCartItems();

      setItems(data);

      const qty = data.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      );

      setCartCount(qty);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadCart();
    }
  }, [isOpen]);

  const subtotal = useMemo(() => {
    return items.reduce((sum: number, item: any) => {
      const product = item.products;

      const price =
        product?.discount_price ??
        product?.price ??
        0;

      return sum + price * item.quantity;
    }, 0);
  }, [items]);

  async function increase(item: CartItem) {
    await updateCartQuantity(
      item.id,
      item.quantity + 1
    );

    loadCart();
  }

  async function decrease(item: CartItem) {
    await updateCartQuantity(
      item.id,
      item.quantity - 1
    );

    loadCart();
  }

  async function remove(id: string) {
    await removeCartItem(id);

    loadCart();
  }

  return (
    <>
      {/* Backdrop */}

      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[998] bg-black/40 transition-all duration-300 ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      />

      {/* Drawer */}

      <aside
        className={`fixed right-0 top-0 z-[999] h-screen w-full max-w-md bg-white shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-5">

          <h2 className="text-xl font-bold text-[#1F2937]">
            Shopping Cart
          </h2>

          <button
            onClick={closeCart}
            className="rounded-full p-2 hover:bg-[#F8F4EC]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}

        <div className="flex-1 overflow-y-auto">

          {loading && (
            <div className="p-8 text-center text-gray-500">
              Loading...
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center p-8">

              <ShoppingBag
                size={70}
                className="text-[#B6862C]"
              />

              <h3 className="mt-4 text-[#B6862C] text-xl font-semibold">
                Your cart is empty
              </h3>

              <p className="mt-2 text-gray-500 text-center">
                Add your favourite products.
              </p>

            </div>
          )}

          {!loading &&
            items.map((item) => (
              <CartDrawerItem
                key={item.id}
                item={item}
                onIncrease={() => increase(item)}
                onDecrease={() => decrease(item)}
                onRemove={() => remove(item.id)}
              />
            ))}
        </div>

        {/* Footer */}

        <div className="border-t bg-white p-6">

          <div className="mb-5 flex justify-between text-lg font-semibold">

            <span className="text-[#B6862C]">
              Total
              </span>

            <span className="text-[#B6862C]">
              ৳{subtotal.toLocaleString()}
            </span>

          </div>

          <button
            className="w-full rounded-xl bg-[#B6862C] py-3 font-semibold text-white transition hover:bg-[#9A741E]"
          >
            Checkout ({cartCount})
          </button>

        </div>
      </aside>
    </>
  );
}