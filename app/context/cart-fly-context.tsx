"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

type FlyItem = {
  image: string;
  startX: number;
  startY: number;
};

type CartFlyContextType = {
  flyItem: FlyItem | null;
  startFly: (item: FlyItem) => void;
  endFly: () => void;
};

const CartFlyContext =
  createContext<CartFlyContextType | null>(null);

export function CartFlyProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [flyItem, setFlyItem] =
    useState<FlyItem | null>(null);

  function startFly(item: FlyItem) {
    setFlyItem(item);
  }

  function endFly() {
    setFlyItem(null);
  }

  return (
    <CartFlyContext.Provider
      value={{
        flyItem,
        startFly,
        endFly,
      }}
    >
      {children}
    </CartFlyContext.Provider>
  );
}

export function useCartFly() {
  const context = useContext(CartFlyContext);

  if (!context) {
    throw new Error(
      "useCartFly must be used inside CartFlyProvider"
    );
  }

  return context;
}