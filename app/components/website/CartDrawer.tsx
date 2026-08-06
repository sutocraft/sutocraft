"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  X,
  ShoppingBag,
} from "lucide-react";

import {
  getCartItems,
  clearCart,
  updateCartQuantity,
  removeCartItem,
} from "@/lib/cart";

import { useCart } from "@/lib/cart-context";
import { useTheme } from "@/app/components/website/settings.theme_color";
import CartDrawerItem from "./CartDrawerItem";

type CartItem = {
  id: string;
  quantity: number;

  products: {
    id: string;
    name: string;
    price: number;
    sale_price: number | null;
    slug: string;

    product_images: {
      image_url: string;
      is_primary: boolean;
    }[];
  };

  sizes: {
    id: string;
    name: string;
  } | null;

  colors: {
    id: string;
    name: string;
  } | null;
};

export default function CartDrawer() {
  const {
  isOpen,
  closeCart,
  cartCount,
  setCartCount,
} = useCart();

function handleCloseDrawer() {
  closeCart();
}

  const {
    themeColor,
  } = useTheme();

  const [loading, setLoading] = useState(false);

const [updatingId, setUpdatingId] =
  useState<string | null>(null);

  const [items, setItems] = useState<CartItem[]>([]);

    async function loadCart() {
    try {
      setLoading(true);

      const data = await getCartItems();

      setItems(data as CartItem[]);

      const totalQty = data.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      );

      setCartCount(totalQty);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  if (!isOpen) return;

  loadCart();

  if (!window.history.state?.cartDrawer) {
  window.history.pushState(
    { cartDrawer: true },
    ""
  );
}

  const handlePopState = (e: PopStateEvent) => {
  if (e.state?.cartDrawer) {
    closeCart();
  }
};

  window.addEventListener(
    "popstate",
    handlePopState
  );

  return () => {
    window.removeEventListener(
      "popstate",
      handlePopState
    );
  };
}, [isOpen]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const price =
        item.products?.sale_price ??
        item.products?.price ??
        0;

      return sum + price * item.quantity;
    }, 0);
  }, [items]);

  async function handleIncrease(item: CartItem) {
  setUpdatingId(item.id);

  const oldItems = items;

  const newItems = items.map((i) =>
    i.id === item.id
      ? {
          ...i,
          quantity: i.quantity + 1,
        }
      : i
  );

  setItems(newItems);

  setCartCount(cartCount + 1);

  try {
    await updateCartQuantity(
      item.id,
      item.quantity + 1
    );
  } catch (error) {
    console.error(error);

    setItems(oldItems);
    setCartCount(cartCount);
  } finally {
    setUpdatingId(null);
  }
}

  async function handleDecrease(item: CartItem) {
  if (item.quantity <= 1) {
    return handleRemove(item);
  }

  setUpdatingId(item.id);

  const oldItems = items;

  const newItems = items.map((i) =>
    i.id === item.id
      ? {
          ...i,
          quantity: i.quantity - 1,
        }
      : i
  );

  setItems(newItems);

  setCartCount(cartCount - 1);

  try {
    await updateCartQuantity(
      item.id,
      item.quantity - 1
    );
  } catch (error) {
    console.error(error);

    setItems(oldItems);
    setCartCount(cartCount);
  } finally {
    setUpdatingId(null);
  }
}

  async function handleRemove(item: CartItem) {
  setUpdatingId(item.id);

  try {
    await removeCartItem(item.id);

    await loadCart();
  } finally {
    setUpdatingId(null);
  }
}

  async function handleClearCart() {
    await clearCart();

    setItems([]);

    setCartCount(0);
  }

    return (
    <>
      {/* Backdrop */}

      <div
        onClick={handleCloseDrawer}
        className={`fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm transition-all duration-300 ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      />

      {/* Drawer */}

      <aside
  className={`fixed top-0 right-0 z-[91] flex h-dvh w-full max-w-[460px] flex-col bg-[#FDFBF7] shadow-2xl transition-transform duration-300 ${
    isOpen
      ? "translate-x-0"
      : "translate-x-full"
  }`}
  style={{
    paddingTop: "env(safe-area-inset-top)",
    paddingBottom: "env(safe-area-inset-bottom)",
  }}
>
        {/* Header */}

        <div
          className="flex items-center justify-between border-b px-6 py-5"
          style={{
            borderColor: `${themeColor}25`,
          }}
        >
          <div>
            <h2 className="text-2xl font-bold text-[#1F2937]">
              Shopping Cart
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {cartCount} Item(s)
            </p>
          </div>

          <button
            onClick={handleCloseDrawer}
            className="rounded-full p-2 transition hover:bg-gray-100"
          >
            <X
              size={20}
              style={{
                color: themeColor,
              }}
            />
          </button>
        </div>

        {/* Body */}

        <div
  className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5"
  style={{
    overscrollBehavior: "contain",
    WebkitOverflowScrolling: "touch",
  }}
>

                    {loading && (
            <div className="flex items-center justify-center py-16">
              <p className="text-gray-500">
                Loading cart...
              </p>
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">

              <ShoppingBag
                size={70}
                style={{
                  color: themeColor,
                }}
              />

              <h3 className="mt-6 text-xl font-semibold text-[#1F2937]">
                Your cart is empty
              </h3>

              <p className="mt-2 text-center text-gray-500">
                Add products to continue shopping.
              </p>

            </div>
          )}

          {!loading &&
            items.length > 0 &&
            items.map((item) => (
              <CartDrawerItem
  key={item.id}
  item={item}
  themeColor={themeColor}
  loading={updatingId === item.id}
  onIncrease={() => handleIncrease(item)}
  onDecrease={() => handleDecrease(item)}
  onRemove={() => handleRemove(item)}
/>
            ))}

        </div>

               {/* Footer */}

<div
  className="sticky bottom-0 border-t bg-white px-4 py-4 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] sm:px-5 sm:py-5"
  style={{
    borderColor: `${themeColor}25`,
  }}
>
  <div className="mb-5 flex items-center justify-between">
    <span
  className="text-lg font-semibold"
  style={{
    color: themeColor,
  }}
>
  Subtotal
</span>

    <span
      className="text-2xl font-bold"
      style={{
        color: themeColor,
      }}
    >
      ৳ {subtotal.toLocaleString()}
    </span>
  </div>

  {items.length > 0 && (
    <button
      onClick={handleClearCart}
      className="mb-4 w-full rounded-xl border py-3 font-semibold transition-all duration-200 hover:bg-[#F8F5EF]"
      style={{
        borderColor: themeColor,
        color: themeColor,
      }}
    >
      Clear Cart
    </button>
  )}

  <div className="grid gap-3">
    <Link
      href="/cart"
      onClick={handleCloseDrawer}
      className="rounded-xl border py-3 text-center font-semibold transition-all duration-200 hover:bg-[#F8F5EF]"
      style={{
        borderColor: themeColor,
        color: themeColor,
      }}
    >
      View Cart
    </Link>

    <Link
      href="/checkout"
      onClick={handleCloseDrawer}
      className="rounded-xl py-3 text-center font-semibold text-white transition-opacity duration-200 hover:opacity-90"
      style={{
        backgroundColor: themeColor,
      }}
    >
      Proceed to Checkout
    </Link>
  </div>
</div>

</aside>

</>
);
}