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

type Color = {
  id: string;
  name: string;
  code?: string;
};

type Props = {
  product: WebsiteProduct;

  selectedSize: string;
  selectedColor: string;

  quantity: number;

  onIncrease: () => void;
  onDecrease: () => void;

  sizes: Size[];
  colors: Color[];

  onSizeChange: (
    id: string
  ) => void;

  onColorChange: (
    id: string
  ) => void;

  onAddToCart: () => void;
  onBuyNow: () => void;
};

export default function ProductInfo({
  product,

  selectedSize,
  selectedColor,

  quantity,

  onIncrease,
  onDecrease,

  sizes,
  colors,

  onSizeChange,
  onColorChange,

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
              style={{
    color: themeColor,
  }}
>
              SKU :

              <span
                className="
                  ml-1

                  font-semibold
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
                  background:
                    `${themeColor}12`,
                  color:
                    themeColor,
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
                  background:
                    `${themeColor}12`,
                  color:
                    themeColor,
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

              text-gray-600
            "
            style={{
              color: themeColor,
            }}
          >
            {product.short_description}
          </p>

        )}

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
            borderColor:
              `${themeColor}25`,
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

            {/* Size */}

      {sizes.length > 0 && (

        <div className="mt-8">

          <h3
  className="
    mb-3
    text-[13px]
    font-bold
    uppercase
    tracking-[0.15em]
  "
  style={{
    color: themeColor,
  }}
>
  Select Size
</h3>

          <div className="flex flex-wrap gap-3">

            {sizes.map((size) => {

              const active =
                selectedSize === size.id;

              return (

                <button
                  key={size.id}
                  onClick={() =>
                    onSizeChange(
                      size.id
                    )
                  }
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
                    borderColor:
                      active
                        ? themeColor
                        : `${themeColor}30`,

                    background:
                      active
                        ? themeColor
                        : "#FFFFFF",

                    color:
                      active
                        ? "#FFFFFF"
                        : "#2B2B2B",
                  }}
                >
                  {size.name}
                </button>

              );

            })}

          </div>

        </div>

      )}

      {/* Color */}

      {colors.length > 0 && (

        <div className="mt-8">

          <h3
  className="
    mb-4
    text-[13px]
    font-bold
    uppercase
    tracking-[0.15em]
  "
  style={{
    color: themeColor,
  }}
>
  Select Color
</h3>

          <div className="flex flex-wrap gap-3">

            {colors.map(
              (color) => {

                const active =
                  selectedColor ===
                  color.id;

                return (

                  <button
                    key={color.id}
                    onClick={() =>
                      onColorChange(
                        color.id
                      )
                    }
                    className="
                      flex

                      min-w-[110px]

                      items-center

                      gap-3

                      rounded-2xl

                      border

                      px-4
                      py-3

                      transition-all
                      duration-300
                    "
                    style={{
                      borderColor:
                        active
                          ? themeColor
                          : `${themeColor}30`,

                      background:
                        active
                          ? themeColor
                          : "#FFFFFF",

                      color:
                        active
                          ? "#FFFFFF"
                          : "#2B2B2B",
                    }}
                  >

                    <span
                      className="
                        h-5
                        w-5

                        rounded-full

                        border-2
                      "
                      style={{
                        background:
                          color.code ||
                          themeColor,

                        borderColor:
                          active
                            ? "#FFFFFF"
                            : "#D1D5DB",
                      }}
                    />

                    <span
                      className="
                        text-sm

                        font-semibold
                      "
                    >
                      {color.name}
                    </span>

                  </button>

                );

              }
            )}

          </div>

        </div>

      )}

            {/* Quantity */}

      <div className="mt-8">

        <h3
  className="
    mb-4
    text-[13px]
    font-bold
    uppercase
    tracking-[0.15em]
  "
  style={{
    color: themeColor,
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
              borderColor:
                `${themeColor}30`,
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

                text-lg

                font-bold
              "
              style={{
                borderColor:
                  `${themeColor}30`,
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
              background:
                `${themeColor}10`,
            }}
          >

            <span
              className="text-sm"
style={{
  color: themeColor,
}}
            >
              Available
            </span>

            <span
              className="
                ml-2

                text-base

                font-bold
              "
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

            rounded-2xl

            border-2

            bg-white

            text-base

            font-bold

            transition-all
            duration-300
          "
          style={{
            borderColor:
              themeColor,
            color:
              themeColor,
          }}
        >
          Buy Now
        </button>

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
          borderColor:
            `${themeColor}25`,
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
            borderColor:
              `${themeColor}15`,
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


