"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import ProductDetails from "./ProductDetails";
import MobileBottomNav from "./MobileBottomNav";

type Props = {
  open: boolean;
  slug: string;
  onClose: () => void;
  useHistory?: boolean;
};

export default function ProductDetailsModal({
  open,
  slug,
  onClose,
  useHistory = true,
}: Props) {
  const [currentSlug, setCurrentSlug] =
    useState(slug);

  /*
   * Keep current product synchronized
   */
  useEffect(() => {
    setCurrentSlug(slug);
  }, [slug]);

  /*
   * Related Products changes the product
   * inside the SAME popup.
   */
  useEffect(() => {
    if (!open) return;

    const handleProductChange = (
      event: Event
    ) => {
      const customEvent =
        event as CustomEvent<{
          slug?: string;
        }>;

      const nextSlug =
        customEvent.detail?.slug;

      if (!nextSlug) return;

      setCurrentSlug(nextSlug);
    };

    window.addEventListener(
      "product-modal-change",
      handleProductChange
    );

    return () => {
      window.removeEventListener(
        "product-modal-change",
        handleProductChange
      );
    };
  }, [open]);

  /*
   * Lock background scrolling
   */
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    document.body.classList.add(
      "product-modal-open"
    );

    if (useHistory) {
      window.history.pushState(
        { productModal: true },
        ""
      );
    }

    const handlePopState = () => {
      onClose();
    };

    const handleKeyDown = (
      e: KeyboardEvent
    ) => {
      if (e.key !== "Escape") return;

      if (
        useHistory &&
        window.history.state?.productModal
      ) {
        window.history.back();
      } else {
        onClose();
      }
    };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow = "";

      document.body.classList.remove(
        "product-modal-open"
      );

      window.removeEventListener(
        "popstate",
        handlePopState
      );

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose, useHistory]);

  if (!open) return null;

  const closeModal = () => {
    if (
      useHistory &&
      window.history.state?.productModal
    ) {
      window.history.back();
    } else {
      onClose();
    }
  };

  return (
    <div
      onClick={closeModal}
      className="
        fixed
        inset-0
        z-[9999]
        bg-black/60
        backdrop-blur-sm
      "
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        className="
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2

          w-[96vw]
          max-w-[1080px]

          h-[92vh]
          max-h-[900px]

          overflow-hidden
          rounded-2xl
          sm:rounded-3xl

          bg-[var(--theme-background)]
          shadow-2xl

          sm:w-[94vw]
          lg:w-[1000px]
        "
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeModal}
          className="
            absolute
            right-4
            top-4
            z-[100]

            flex
            h-10
            w-10
            items-center
            justify-center

            rounded-full
            bg-white
            text-[#2B2B2B]

            shadow-md
            transition

            hover:bg-[var(--theme-color)]
            hover:text-white
          "
        >
          <X size={20} />
        </button>

        {/*
         * Compact content scale.
         *
         * CSS zoom is used instead of transform: scale()
         * so the scroll height and layout remain correct.
         *
         * Desktop: 88%
         * Smaller screens: normal size
         */}
        <div
          className="
            relative
            h-full
            overflow-y-auto
            overflow-x-hidden
            overscroll-contain
            pb-6
            sm:pb-8
          "
        >
          <div
            className="
              w-full
              origin-top
              lg:[zoom:0.72]
            "
          >
            <ProductDetails
              slug={currentSlug}
            />
          </div>

          <div className="lg:hidden">
            <MobileBottomNav />
          </div>
        </div>
      </div>
    </div>
  );
}