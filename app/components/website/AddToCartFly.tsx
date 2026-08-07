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
${dx * .22}px,
${dy * .18}px,
0
)
scale(.96)
rotate(-10deg)
`,

  opacity: .95,

  filter:
    "drop-shadow(0 22px 40px rgba(0,0,0,.35))",

  transition:
  "all .55s cubic-bezier(.18,.88,.22,1)",

});

setTimeout(() => {

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
${dy}px,
0
)
scale(.18)
rotate(16deg)
`,

    opacity: 0,

    filter:
      "drop-shadow(0 30px 60px rgba(0,0,0,.22))",

    transition:
  "all .72s cubic-bezier(.18,.88,.22,1)",

  });

}, 480);

      });
    });

    const timer = setTimeout(() => {

  const cartButton =
    document.getElementById(
      window.innerWidth < 1024
        ? (
            document.getElementById("bottom-cart")
              ? "bottom-cart"
              : "header-cart-mobile"
          )
        : "header-cart"
    );

  if (cartButton) {

    cartButton.animate(
      [

        {
          transform:
            "translate3d(0,0,0) scale(1)",
        },

        {
          transform:
            "translate3d(0,-4px,0) scale(1.24)",
        },

        {
          transform:
            "translate3d(0,2px,0) scale(.90)",
        },

        {
          transform:
            "translate3d(0,-2px,0) scale(1.10)",
        },

        {
          transform:
            "translate3d(0,0,0) scale(1)",
        },

      ],
      {

        duration: 700,

        easing:
          "cubic-bezier(.18,.88,.22,1)",

      }
    );

  }

  if (
    typeof navigator !== "undefined" &&
    "vibrate" in navigator
  ) {
    navigator.vibrate(20);
  }

  endFly();

}, 1200);

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
      select-none
      will-change-transform
      will-change-opacity
      transform-gpu
    "
    style={{
      ...style,
      backfaceVisibility: "hidden",
      transformStyle: "preserve-3d",
      perspective: "1000px",
      WebkitBackfaceVisibility: "hidden",
      WebkitTransform: "translateZ(0)",
    }}
  >
    <Image
      src={flyItem.image || "/placeholder.png"}
      alt="Product"
      width={flySize}
      height={flySize}
      priority
      draggable={false}
      className="
        rounded-3xl
        object-cover
        pointer-events-none
        select-none
        ring-1
        ring-white/70
        shadow-2xl
        will-change-transform
        will-change-opacity
        transform-gpu
      "
      style={{
        backfaceVisibility: "hidden",
        transformStyle: "preserve-3d",
        imageRendering: "auto",
      }}
    />
  </div>
);
}