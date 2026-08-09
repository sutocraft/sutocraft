"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import ProductDetails from "./ProductDetails";

import MobileBottomNav from "./MobileBottomNav";

type Props = {
  open: boolean;
  slug: string;
  onClose: () => void;

  // Default true keeps existing Home Page behavior
  useHistory?: boolean;
};

export default function ProductDetailsModal({
  open,
  slug,
  onClose,
  useHistory = true,
}: Props) {
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    document.body.classList.add(
      "product-modal-open"
    );

    /*
     * Only create a browser history entry when requested.
     *
     * Home Page:
     * useHistory = true  → existing behavior
     *
     * Products Page desktop:
     * useHistory = false → no extra history entry
     */
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
      if (e.key === "Escape") {
        if (
          useHistory &&
          window.history.state?.productModal
        ) {
          window.history.back();
        } else {
          onClose();
        }
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
          inset-0
          mx-auto
          h-screen
          w-full
          overflow-hidden
          bg-[#F8F5EE]

          lg:h-[95vh]
          lg:max-w-7xl
          lg:translate-y-[2.5vh]
          lg:rounded-3xl
          lg:shadow-2xl
        "
      >
        <button
          onClick={closeModal}
          className="
            absolute
            right-5
            top-5
            z-50
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-white
            text-[#2B2B2B]
            shadow-lg
            transition
            hover:bg-[#98691D]
            hover:text-white
          "
        >
          <X size={22} />
        </button>

        <div className="relative h-full overflow-y-auto pb-24">
          <ProductDetails slug={slug} />

          <div className="lg:hidden">
            <MobileBottomNav />
          </div>
        </div>
      </div>
    </div>
  );
}