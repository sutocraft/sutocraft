"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import ProductDetails from "./ProductDetails";

type Props = {
  open: boolean;
  slug: string;
  onClose: () => void;
};

export default function ProductDetailsModal({
  open,
  slug,
  onClose,
}: Props) {
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (
      e: KeyboardEvent
    ) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow = "";

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm"
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        className="absolute inset-0 mx-auto h-screen w-full overflow-hidden bg-[#F8F5EE] lg:h-[95vh] lg:max-w-7xl lg:translate-y-[2.5vh] lg:rounded-3xl lg:shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#2B2B2B] shadow-lg transition hover:bg-[#98691D] hover:text-white"
        >
          <X size={22} />
        </button>

        <div className="h-full overflow-y-auto">
          <ProductDetails slug={slug} />

                  </div>
      </div>
    </div>
  );
}