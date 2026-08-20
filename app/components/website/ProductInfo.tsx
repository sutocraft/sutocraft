"use client";

import {
  Star,
  ShieldCheck,
  Truck,
  PackageCheck,
} from "lucide-react";

import {
  useTheme,
} from "@/app/components/website/settings.theme_color";

import type {
  WebsiteProduct,
} from "@/lib/products";

type Size = {
  id: string;
  name: string;
};



type Props = {
  product: WebsiteProduct;

  selectedSize: string;


  quantity: number;

  onIncrease: () => void;
  onDecrease: () => void;

  sizes: Size[];


  onSizeChange: (
    id: string
  ) => void;


  onAddToCart: () => void;
  onBuyNow: () => void;
};

export default function ProductInfo({
  product,

  selectedSize,


  quantity,

  onIncrease,
  onDecrease,

  sizes,


  onSizeChange,

  onAddToCart,
  onBuyNow,
}: Props) {

  const {
    themeColor,
  } = useTheme();

  const price =
    product.sale_price ??
    product.price;

  const oldPrice =
    product.sale_price
      ? product.price
      : null;

  const inStock =
    product.stock > 0;

  return (

    <div className="flex h-full flex-col">

      <div className="space-y-5">

        {/* Badge */}

        <div className="flex flex-wrap items-center gap-2">

          {product.discount_percentage >
            0 && (

            <span
              className="
                rounded-full

                px-3
                py-1

                text-xs
                font-bold

                text-white
              "
              style={{
                background:
                  "#FF214F",
              }}
            >
              -
              {
                product.discount_percentage
              }
              %
            </span>

          )}

          <span
            className="
              rounded-full

              px-3
              py-1

              text-xs
              font-semibold
            "
            style={{
              background:
                inStock
                  ? "#DCFCE7"
                  : "#FEE2E2",

              color:
                inStock
                  ? "#15803D"
                  : "#DC2626",
            }}
          >
            {inStock
              ? "In Stock"
              : "Out Of Stock"}
          </span>

        </div>

        {/* Title */}

        <h1
          className="
            text-2xl

            font-bold

            leading-tight

            sm:text-3xl

            lg:text-4xl
          "
          style={{
            color:
              "#2B2B2B",
          }}
        >
          {product.name}
        </h1>

        {/* Rating */}

        <div
          className="
            flex
            flex-wrap

            items-center

            gap-4

            text-sm
          "
        >

          <div className="flex items-center gap-1">

            <Star
              size={16}
              className="
                fill-yellow-400
                text-yellow-400
              "
            />

            <span
              className="font-semibold"
            >
              4.9
            </span>

            <span
              style={{
    color: themeColor,
  }}
>
              (128 Reviews)
            </span>

          </div>

          {product.sku && (

            <span
                className="
                  ml-1

                  font-semibold
                  text-[15px]
                "

            
              style={{
    color: themeColor,
  }}
>
              SKU :

              <span
                className="
                  ml-1

                  font-semibold
                  text-[15px]
                "
                style={{
                  color:
                    "#2B2B2B",
                }}
              >
                {product.sku}
              </span>

            </span>

          )}

        </div>

                {/* Category */}

        {(product.category ||
          product.sub_category) && (

          <div className="flex flex-wrap gap-2">

            {product.category && (

              <span
                className="
                  rounded-full

                  px-3
                  py-1

                  text-xs
                  font-semibold
                "
                style={{
                  background: "var(--theme-color-10)",
color: themeColor,
                }}
              >
                {product.category.name}
              </span>

            )}

            {product.sub_category && (

              <span
                className="
                  rounded-full

                  px-3
                  py-1

                  text-xs
                  font-semibold
                "
                style={{
                  background: "var(--theme-color-10)",
color: themeColor,
                }}
              >
                {product.sub_category.name}
              </span>

            )}

          </div>

        )}

        {/* Price */}

        <div className="flex items-end gap-3">

          <span
            className="
              text-3xl
              font-extrabold

              sm:text-4xl
            "
              style={{
                color:
                  themeColor,
              }}
            >
            ৳{price}
          </span>

          {oldPrice && (

            <span
              className="
                pb-1

                text-lg

                text-gray-400

                line-through
              "
              style={{
                color: themeColor,
              }}
            >
              ৳{oldPrice}
            </span>

          )}

        </div>

        {/* Short Description */}

        {product.short_description && (

          <p
            className="
              leading-7

              font-extrabold

              text-lg

              text-gray-600
            "
            style={{
                  color:
                    "#2B2B2B",
                }}
          >
            {product.short_description}
          </p>

        )}

      </div>

            {/* Size */}

      {sizes.length > 0 && (

        <div className="mt-8">

          <h3
  className="
    mb-3
    text-[15px]
    font-bold
    uppercase
    tracking-[0.15em]
  
                "
                style={{
                  color:
                    "#2B2B2B",
                }}
              >

  Select Size
</h3>

          <div className="flex flex-wrap gap-3">

           {sizes.map((size) => {
  const active =
    product.size_ids?.includes(size.id) ?? false;

  const selected =
    selectedSize === size.id;

  return (
    <button
      key={size.id}
      type="button"
      disabled={!active}
      onClick={() => {
        if (active) {
          onSizeChange(size.id);
        }
      }}
      className="
        min-w-[54px]
        rounded-2xl
        border
        px-5
        py-3
        text-sm
        font-semibold
        transition-all
        duration-300
      "
      style={{
        borderColor: selected
  ? themeColor
  : active
  ? "var(--theme-color-20)"
  : "#D1D5DB",

        background: selected
          ? themeColor
          : active
          ? "#FFFFFF"
          : "#F3F4F6",

        color: selected
          ? "#FFFFFF"
          : active
          ? "#2B2B2B"
          : "#9CA3AF",

        opacity: active ? 1 : 0.45,

        cursor: active
          ? "pointer"
          : "not-allowed",
      }}
    >
      {size.name}
    </button>
  );
})}

          </div>

        </div>

      )}

      

            {/* Quantity */}

      <div className="mt-8">

        <h3
  className="
    mb-4
    text-[15px]
    font-bold
    uppercase
    tracking-[0.15em]
  "
  style={{
                  color:
                    "#2B2B2B",
                }}
              >
  Quantity
</h3>

        <div
          className="
            flex
            flex-wrap

            items-center
            justify-between

            gap-5
          "
        >

          <div
            className="
              flex

              items-center

              overflow-hidden

              rounded-2xl

              border

              bg-white
            "
            style={{
              borderColor: "var(--theme-color-20)",
            }}
          >

            <button
              onClick={onDecrease}
              className="
                flex

                h-12
                w-12

                items-center
                justify-center

                text-2xl

                font-bold

                transition-all
                duration-300
              "
              style={{
                color: themeColor,
              }}
            >
              −
            </button>

            <div
  className="
    flex

    h-12
    min-w-[68px]

    items-center
    justify-center

    border-x

    bg-gray-50

    text-[25px]

    font-bold
  "
  style={{
    borderColor: "var(--theme-color-20)",
    color: themeColor,
  }}
>
  {quantity}
</div>

            <button
              onClick={onIncrease}
              className="
                flex

                h-12
                w-12

                items-center
                justify-center

                text-2xl

                font-bold

                transition-all
                duration-300
              "
              style={{
                color: themeColor,
              }}
            >
              +
            </button>

          </div>

          <div
            className="
              rounded-2xl

              px-4
              py-3
            "
            style={{
              background: `${themeColor}10`,
            }}
          >

            <span
               className="

            items-center
            justify-center

            rounded-2xl

            text-[13px]

            font-bold
  "
  style={{
                  color:
                    "#2B2B2B",
                }}
              >
              Available :
            </span>

            <span
              className="
                ml-2

                text-[18px]

                font-bold
              "
            style={{
                color: themeColor,
              }}
            >
              {product.stock}
            </span>

          </div>

        </div>

      </div>

      {/* Primary Buttons */}

      <div className="mt-10 space-y-4">

        <button
          onClick={onAddToCart}
          disabled={!inStock}
          className="
            flex

            h-14
            w-full

            items-center
            justify-center

            rounded-2xl

            text-base

            font-bold

            text-white

            transition-all
            duration-300

            hover:-translate-y-1

            disabled:cursor-not-allowed
            disabled:bg-gray-300
          "
          style={{
            background:
              themeColor,
          }}
        >
          Add To Cart
        </button>

        <button
          onClick={onBuyNow}
          disabled={!inStock}
          className="
  flex
  h-14
  w-full
  items-center
  justify-center
  gap-3
  rounded-2xl
  border-2
  bg-white
  text-base
  font-bold
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
          Buy Now
        </button>

      </div>

      {/* Feature Cards */}
      

      <div
        className="
          mt-8

          grid

          grid-cols-3

          gap-3
        "
      >

        <div
          className="
            rounded-2xl

            border

            bg-white

            p-4

            text-center
          "
          style={{
            borderColor:
              `${themeColor}25`,
          }}
        >

          <Truck
            size={22}
            className="mx-auto mb-2"
            style={{
              color:
                themeColor,
            }}
          />

          <p
  className="
    text-xs
    font-semibold
  "
  style={{
    color: themeColor,
  }}
>
  Fast Delivery
</p>

        </div>

        <div
          className="
            rounded-2xl

            border

            bg-white

            p-4

            text-center
          "
          style={{
            borderColor:
              `${themeColor}25`,
          }}
        >

          <ShieldCheck
            size={22}
            className="mx-auto mb-2"
            style={{
              color:
                themeColor,
            }}
          />

          <p
  className="
    text-xs
    font-semibold
  "
  style={{
    color: themeColor,
  }}
>
  Quality
</p>

        </div>

        <div
          className="
            rounded-2xl

            border

            bg-white

            p-4

            text-center
          "
          style={{
            borderColor: "var(--theme-color-15)",
          }}
        >

          <PackageCheck
            size={22}
            className="mx-auto mb-2"
            style={{
              color:
                themeColor,
            }}
          />

          <p
  className="
    text-xs
    font-semibold
  "
  style={{
    color: themeColor,
  }}
>
  Quality
</p>

        </div>

      </div>

            {/* Extra Information */}

      <div
        className="
          mt-10

          rounded-3xl

          border

          bg-white

          p-6
        "
        style={{
          borderColor: "var(--theme-color-15)",
        }}
      >

        <div
          className="
            flex

            items-center

            justify-between

            border-b

            pb-3
          "
          style={{
            borderColor: "var(--theme-color-15)",
          }}
        >

          <span
  style={{
    color: themeColor,
  }}
>
  Brand
</span>

          <span
             style={{
    color: themeColor,
  }}
>
            {product.brand?.name ??
              "SutoCraft"}
          </span>

        </div>

        <div
          className="
            mt-3

            flex

            items-center

            justify-between

            border-b

            pb-3
          "
          style={{
            borderColor:
              `${themeColor}15`,
          }}
        >

          <span
  style={{
    color: themeColor,
  }}
>
  Category
</span>

          <span
             style={{
    color: themeColor,
  }}
>
            {product.category?.name ??
              "-"}
          </span>

        </div>

        <div
          className="
            mt-3

            flex

            items-center

            justify-between
          "
        >

          <span
  style={{
    color: themeColor,
  }}
>
  Availability
</span>

          <span
            className="font-semibold"
            style={{
              color: inStock
                ? "#16A34A"
                : "#DC2626",
            }}
          >
            {inStock
              ? "In Stock"
              : "Out Of Stock"}
          </span>

        </div>

      </div>

    </div>

  );

}