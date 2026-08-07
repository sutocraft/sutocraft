"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useCartFly } from "@/app/context/cart-fly-context";
import { getCartPosition } from "@/lib/fly";

export default function AddToCartFly() {
  const { flyItem, endFly } = useCartFly();

  const [style, setStyle] =
    useState<React.CSSProperties>();

  const [flySize, setFlySize] =
    useState(120);

  useEffect(() => {
    function updateSize() {
      if (window.innerWidth < 640) {
        setFlySize(62);
      } else if (window.innerWidth < 1024) {
        setFlySize(82);
      } else {
        setFlySize(120);
      }
    }

    updateSize();

    window.addEventListener(
      "resize",
      updateSize
    );

    return () =>
      window.removeEventListener(
        "resize",
        updateSize
      );
  }, []);

  useEffect(() => {
    if (!flyItem) return;

    const cart = getCartPosition();

    setStyle({
      left:
        flyItem.startX -
        flySize / 2,

      top:
        flyItem.startY -
        flySize / 2,

      transform:
        "translate3d(0,0,0) scale(1) rotate(0deg)",

      opacity: 1,

      filter:
        "drop-shadow(0 12px 28px rgba(0,0,0,.28))",
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {

        const dx =
          cart.x -
          flyItem.startX;

        const dy =
          cart.y -
          flyItem.startY;

        const curve =
          window.innerWidth < 1024
            ? -120
            : -180;

        setStyle({
          left:
            flyItem.startX -
            flySize / 2,

          top:
            flyItem.startY -
            flySize / 2,

          transform: `
translate3d(
${dx}px,
${dy + curve}px,
0
)
scale(.78)
rotate(-14deg)
`,

          opacity: .95,

          filter:
            "drop-shadow(0 22px 40px rgba(0,0,0,.35))",

          transition:
            "all .58s cubic-bezier(.22,.82,.22,1)",
        });

      });
    });

    const timer = setTimeout(() => {
      const cartButton =
        document.getElementById(
          "header-cart"
        );

      if (cartButton) {
        cartButton.animate(
          [
            {
              transform:
                "scale(1)",
            },
            {
              transform:
                "scale(1.18)",
            },
            {
              transform:
                "scale(.92)",
            },
            {
              transform:
                "scale(1.08)",
            },
            {
              transform:
                "scale(1)",
            },
          ],
          {
            duration: 550,
          }
        );
      }

      endFly();
    }, 650);

    return () =>
      clearTimeout(timer);

  }, [
    flyItem,
    flySize,
    endFly,
  ]);

    if (!flyItem || !style) {
    return null;
  }

  return (

    <div
      className="
        pointer-events-none

        fixed

        left-0
        top-0

        z-[99999]

        will-change-transform
      "
      style={style}
    >

      <Image
        src={flyItem.image}
        alt="Product"
        width={flySize}
        height={flySize}
        priority
        draggable={false}
        className="
          rounded-2xl

          object-cover

          select-none

          shadow-2xl
        "
      />

    </div>

  );

}