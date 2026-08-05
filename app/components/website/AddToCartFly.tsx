"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useCartFly } from "@/app/context/cart-fly-context";
import { getCartPosition } from "@/lib/fly";

export default function AddToCartFly() {
  const { flyItem, endFly } = useCartFly();

  const [style, setStyle] =
    useState<React.CSSProperties>();

  useEffect(() => {
    if (!flyItem) return;

    const cart = getCartPosition();

    setStyle({
      left: flyItem.startX - 60,
      top: flyItem.startY - 60,
      transform: "translate(0px,0px) scale(1)",
      opacity: 1,
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setStyle({
          left: flyItem.startX - 60,
          top: flyItem.startY - 60,

          transform: `translate(
            ${cart.x - flyItem.startX}px,
            ${cart.y - flyItem.startY}px
          ) scale(.45)`,

          opacity: 0.15,

          transition:
"transform 1.35s cubic-bezier(.17,.84,.44,1), opacity 1.35s"
        });
      });
    });

    const timer = setTimeout(() => {
      const cartButton =
        document.getElementById("header-cart");

      if (cartButton) {
        cartButton.animate(
          [
            {
              transform: "scale(1)",
            },
            {
              transform: "scale(1.15)",
            },
            {
              transform: "scale(1)",
            },
          ],
          {
            duration: 300,
          }
        );
      }

      endFly();
    }, 1400);

    return () => clearTimeout(timer);
  }, [flyItem, endFly]);

  if (!flyItem) return null;

  return (
    <div
      style={{
        position: "fixed",
        width: 120,
        height: 120,
        zIndex: 99999,
        pointerEvents: "none",
        ...style,
      }}
    >
      <Image
        src={flyItem.image}
        alt=""
        fill
        className="rounded-xl object-cover shadow-2xl"
      />
    </div>
  );
}