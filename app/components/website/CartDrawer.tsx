"use client";

import { useCart } from "@/lib/cart-context";

import CartBackdrop from "./CartBackdrop";
import CartDrawerItem from "./CartDrawerItem";

export default function CartDrawer() {

  const {
    isOpen,
    closeCart,
  } = useCart();

  return (
    <>

      <CartBackdrop
        open={isOpen}
        onClose={closeCart}
      />

      <aside
        className={`
          fixed
          top-0
          right-0
          h-screen
          w-[400px]
          bg-white
          shadow-2xl
          z-50
          transition-transform
          duration-300
          ${
            isOpen
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >

        <div className="flex justify-between items-center p-6 border-b">

          <h2 className="text-xl font-bold">
            Shopping Cart
          </h2>

          <button
            onClick={closeCart}
            className="text-2xl"
          >
            ×
          </button>

        </div>

        <div className="p-6">

          <CartDrawerItem
            item={{
              name: "Demo Product",
              quantity: 1,
              price: 1120,
            }}
          />

        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t p-6">

          <button
            className="w-full rounded-lg bg-[#A9781F] text-white py-3"
          >
            Checkout
          </button>

        </div>

      </aside>

    </>
  );

}