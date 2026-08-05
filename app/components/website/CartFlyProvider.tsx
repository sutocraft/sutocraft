"use client";

import { ReactNode } from "react";
import { CartFlyProvider as Provider } from "@/app/context/cart-fly-context";
import AddToCartFly from "./AddToCartFly";

export default function CartFlyProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Provider>
      {children}
      <AddToCartFly />
    </Provider>
  );
}