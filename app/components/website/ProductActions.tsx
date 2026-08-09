"use client";

import {
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingCart,
  Zap,
} from "lucide-react";

import {
  useTheme,
} from "@/app/components/website/settings.theme_color";

type Props = {
  inStock: boolean;

  loading?: boolean;

  wishlist?: boolean;

  onWishlist: () => void;
  onShare: () => void;

  onAddToCart: () => void;
  onBuyNow: () => void;
};

export default function ProductActions({
  inStock,

  loading = false,

  wishlist = false,

  onWishlist,
  onShare,

  onAddToCart,
  onBuyNow,
}: Props) {

  const {
    themeColor,
  } = useTheme();

  return (

    <div className="mt-8 space-y-6">



        <div className="mb-6">

  <button
    onClick={onShare}
    className="
  flex
  h-12
  w-full
  items-center
  justify-center
  gap-2
  rounded-2xl
  border
  bg-white
  text-sm
  font-semibold
  transition-all
  duration-300
  hover:-translate-y-1
  hover:text-white
"
style={{
  borderColor: themeColor,
  color: themeColor,
}}
onMouseEnter={(e) => {
  e.currentTarget.style.background = themeColor;
  e.currentTarget.style.color = "#fff";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.background = "#fff";
  e.currentTarget.style.color = themeColor;
}}
  >
    <Share2 size={18} />
    Share Product
  </button>

</div>

      {/* Trust Section */}

      <div
        className="
          rounded-3xl

          border

          bg-white

          p-6
        "
        style={{
          borderColor: "var(--theme-color-15)",
        }}
      >

        <h3
          className="
            mb-5

            text-sm

            font-bold

            uppercase

            tracking-[0.15em]
          "
          style={{
            color: themeColor,
          }}
        >
          Shop With Confidence
        </h3>

        <div className="space-y-5">

                    <div
            className="
              flex

              items-center

              justify-between

              rounded-2xl

              bg-gray-50

              p-4
            "
          >

            <div className="flex items-center gap-3">

              <Truck
                size={20}
                style={{
                  color: themeColor,
                }}
              />

              <span
                className="
                  text-sm

                  font-medium

                  text-gray-700
                "
              >
                Fast Delivery
              </span>

            </div>

            <span
              className="
                text-sm

                font-semibold
              "
              style={{
                color: themeColor,
              }}
            >
              2–5 Days
            </span>

          </div>

          <div
            className="
              flex

              items-center

              justify-between

              rounded-2xl

              bg-gray-50

              p-4
            "
          >

            <div className="flex items-center gap-3">

              <ShieldCheck
                size={20}
                style={{
                  color: themeColor,
                }}
              />

              <span
                className="
                  text-sm

                  font-medium

                  text-gray-700
                "
              >
                Secure Checkout
              </span>

            </div>

            <span
              className="
                text-sm

                font-semibold
              "
              style={{
                color: themeColor,
              }}
            >
              SSL Protected
            </span>

          </div>

          <div
            className="
              flex

              items-center

              justify-between

              rounded-2xl

              bg-gray-50

              p-4
            "
          >

            <div className="flex items-center gap-3">

              <RotateCcw
                size={20}
                style={{
                  color: themeColor,
                }}
              />

              <span
                className="
                  text-sm

                  font-medium

                  text-gray-700
                "
              >
                Easy Return
              </span>

            </div>

            <span
              className="
                text-sm

                font-semibold
              "
              style={{
                color: themeColor,
              }}
            >
              7 Days
            </span>

          </div>

        </div>

      </div>

            {/* Shipping Notice */}

      <div
        className="
          rounded-3xl

          border

          bg-white

          p-6
        "
        style={{
          borderColor: "var(--theme-color-15)",
        }}
      >

        <h3
          className="
            mb-4

            text-sm

            font-bold

            uppercase

            tracking-[0.15em]
          "
          style={{
            color: themeColor,
          }}
        >
          Shipping Information
        </h3>

        <p
          className="
            text-sm

            leading-7

            text-gray-600
          "
        >
          Your order will be packed carefully and
          shipped using trusted courier partners.
          You will receive order confirmation and
          tracking information immediately after
          dispatch.
        </p>

      </div>

    </div>

  );

}