"use client";

import {
  Heart,
  ShoppingCart,
  Zap,
  Share2,
} from "lucide-react";

type Props = {
  inStock: boolean;

  onAddToCart: () => void;

  onBuyNow: () => void;

  onWishlist: () => void;

  onShare: () => void;

  wishlist?: boolean;

  loading?: boolean;
};

export default function ProductActions({
  inStock,
  onAddToCart,
  onBuyNow,
  onWishlist,
  onShare,
  wishlist = false,
  loading = false,
}: Props) {
  return (
    <div className="mt-8 space-y-4">

      {/* Add To Cart */}

      <button
        onClick={onAddToCart}
        disabled={!inStock || loading}
        className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#98691D] text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#7A5318] disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        <ShoppingCart
          size={20}
          className="transition group-hover:scale-110"
        />

        {loading
          ? "Adding..."
          : "Add To Cart"}
      </button>

      {/* Buy Now */}

      <button
        onClick={onBuyNow}
        disabled={!inStock}
        className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl border-2 border-[#98691D] bg-white text-base font-bold text-[#98691D] transition-all duration-300 hover:bg-[#98691D] hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-300"
      >
        <Zap
          size={20}
          className="transition group-hover:scale-110"
        />

        Buy Now
      </button>

      {/* Secondary Actions */}

      <div className="grid grid-cols-2 gap-3">

        <button
          onClick={onWishlist}
          className={`flex h-12 items-center justify-center gap-2 rounded-xl border transition-all duration-300 ${
            wishlist
              ? "border-[#98691D] bg-[#98691D] text-white"
              : "border-[#E8E1CE] bg-white text-[#2B2B2B] hover:border-[#98691D]"
          }`}
        >
          <Heart
            size={18}
            className={
              wishlist
                ? "fill-current"
                : ""
            }
          />

          Wishlist
        </button>

        <button
          onClick={onShare}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#E8E1CE] bg-white text-[#2B2B2B] transition-all duration-300 hover:border-[#98691D] hover:text-[#98691D]"
        >
          <Share2 size={18} />

          Share
        </button>

      </div>

            {/* Security & Payment */}

      <div className="rounded-3xl border border-[#E8E1CE] bg-[#FDFBF7] p-5">

        <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-[#2B2B2B]">
          Shop With Confidence
        </h3>

        <div className="space-y-3">

          <div className="flex items-center justify-between">

            <span className="text-sm text-gray-600">
              Cash On Delivery
            </span>

            <span className="font-semibold text-green-600">
              Available
            </span>

          </div>

          <div className="flex items-center justify-between">

            <span className="text-sm text-gray-600">
              Secure Checkout
            </span>

            <span className="font-semibold text-[#98691D]">
              SSL Protected
            </span>

          </div>

          <div className="flex items-center justify-between">

            <span className="text-sm text-gray-600">
              Return Policy
            </span>

            <span className="font-semibold text-[#98691D]">
              7 Days
            </span>

          </div>

          <div className="flex items-center justify-between">

            <span className="text-sm text-gray-600">
              Delivery Time
            </span>

            <span className="font-semibold text-[#98691D]">
              2–5 Days
            </span>

          </div>

        </div>

      </div>

      {/* Shipping Notice */}

      <div className="rounded-2xl border border-[#E8E1CE] bg-[#F8F5EE] p-4">

        <p className="text-sm leading-6 text-gray-600">
          Your order will be packed carefully and shipped
          using trusted courier partners. You will receive
          an order confirmation immediately after checkout.
        </p>

      </div>

    </div>
  );
}