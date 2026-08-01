"use client";

import { useEffect, useState } from "react";
import {
  getProductBySlug,
  getProductGallery,
  WebsiteProduct,
} from "@/lib/product";

type Props = {
  slug: string;
};

type GalleryImage = {
  id: string;
  image_url: string;
  sort_order: number;
};

export default function ProductDetails({
  slug,
}: Props) {
  const [product, setProduct] =
    useState<WebsiteProduct | null>(null);

  const [gallery, setGallery] =
    useState<GalleryImage[]>([]);

  const [selectedImage, setSelectedImage] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  async function loadProduct() {
    const data =
      await getProductBySlug(slug);

    if (!data) return;

    setProduct(data);

    setSelectedImage(
      data.image_url || ""
    );

    const images =
      await getProductGallery(
        data.id
      );

    setGallery(images);
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <section className="bg-[#F8F5EE] py-12">
      <div className="mx-auto max-w-7xl px-4">

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

          {/* LEFT */}

          <div className="flex gap-4">

            <div className="flex flex-col gap-3">

              <button
                onClick={() =>
                  setSelectedImage(
                    product.image_url || ""
                  )
                }
                className={`overflow-hidden rounded-xl border-2 ${
                  selectedImage ===
                  product.image_url
                    ? "border-[#98691D]"
                    : "border-gray-200"
                }`}
              >
                <img
                  src={product.image_url || ""}
                  alt=""
                  className="h-24 w-24 object-cover"
                />
              </button>

              {gallery.map((img) => (
                <button
                  key={img.id}
                  onClick={() =>
                    setSelectedImage(
                      img.image_url
                    )
                  }
                  className={`overflow-hidden rounded-xl border-2 ${
                    selectedImage ===
                    img.image_url
                      ? "border-[#98691D]"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={img.image_url}
                    alt=""
                    className="h-24 w-24 object-cover"
                  />
                </button>
              ))}

            </div>

            <div className="relative flex-1 rounded-3xl bg-white p-5">

              {product.new_arrival && (
                <span className="absolute left-5 top-5 rounded-full bg-[#98691D] px-3 py-1 text-xs font-bold text-white">
                  NEW
                </span>
              )}

              {product.discount_percentage >
                0 && (
                <span className="absolute left-5 top-16 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                  -
                  {
                    product.discount_percentage
                  }
                  %
                </span>
              )}

              <img
                src={
                  selectedImage ||
                  product.image_url ||
                  ""
                }
                alt={product.name}
                className="h-[600px] w-full object-contain"
              />

            </div>

          </div>
          {/* RIGHT */}

          {/* RIGHT */}

<div className="space-y-6">

  <h1 className="text-4xl font-bold text-[#2B2B2B]">
    {product.name}
  </h1>

  {/* Rating */}

  <div className="flex items-center gap-2">

    <div className="text-lg text-yellow-500">
      ★★★★★
    </div>

    <span className="text-sm text-gray-500">
      (24 Reviews)
    </span>

  </div>

  {/* Price */}

  <div className="flex items-center gap-4">

    <span className="text-5xl font-bold text-[#98691D]">
      ৳{product.sale_price ?? product.price}
    </span>

    {product.sale_price && (
      <span className="text-2xl text-gray-400 line-through">
        ৳{product.price}
      </span>
    )}

  </div>

  {/* Discount */}

  {product.discount_percentage > 0 && (

    <span className="inline-flex rounded-full bg-red-600 px-3 py-1 text-sm font-semibold text-white">
      {product.discount_percentage}% OFF
    </span>

  )}

  {/* Stock */}

  <div>

    <span
      className={`rounded-full px-3 py-1 text-sm font-semibold ${
        product.stock > 0
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {product.stock > 0
        ? "In Stock"
        : "Out of Stock"}
    </span>

  </div>

  {/* Description */}

  <p className="leading-7 text-gray-700">
    {product.short_description}
  </p>

  {/* Product Info */}

  <div className="rounded-2xl border border-gray-200 bg-white">

    <div className="flex border-b border-gray-200 px-5 py-4">

      <span className="w-40 font-semibold text-[#2B2B2B]">
        SKU
      </span>

      <span className="text-gray-600">
        {product.sku || "-"}
      </span>

    </div>

    <div className="flex border-b border-gray-200 px-5 py-4">

      <span className="w-40 font-semibold text-[#2B2B2B]">
        Brand
      </span>

      <span className="text-gray-600">
        {product.brand?.name || "-"}
      </span>

    </div>

    <div className="flex border-b border-gray-200 px-5 py-4">

      <span className="w-40 font-semibold text-[#2B2B2B]">
        Category
      </span>

      <span className="text-gray-600">
        {product.category?.name || "-"}
      </span>

    </div>

    <div className="flex px-5 py-4">

      <span className="w-40 font-semibold text-[#2B2B2B]">
        Sub Category
      </span>

      <span className="text-gray-600">
        {product.sub_category?.name || "-"}
      </span>

    </div>

  </div>

  {/* Size */}

<div className="mt-8">

  <h3 className="mb-4 text-lg font-semibold text-[#2B2B2B]">
    Size
  </h3>

  <div className="flex flex-wrap gap-3">

    {["S", "M", "L", "XL", "XXL"].map((size) => (

      <button
        key={size}
        className="flex h-12 min-w-[52px] items-center justify-center rounded-xl border border-gray-300 bg-white px-5 font-semibold text-[#2B2B2B] transition-all duration-200 hover:border-[#98691D] hover:bg-[#98691D] hover:text-white"
      >
        {size}
      </button>

    ))}

  </div>

</div>

{/* Color */}

<div className="mt-8">

  <h3 className="mb-4 text-lg font-semibold text-[#2B2B2B]">
    Color
  </h3>

  <div className="flex gap-4">

    <button className="h-11 w-11 rounded-full border-4 border-white bg-black shadow ring-2 ring-gray-300 transition hover:scale-110"></button>

    <button className="h-11 w-11 rounded-full border-4 border-white bg-red-600 shadow ring-2 ring-gray-300 transition hover:scale-110"></button>

    <button className="h-11 w-11 rounded-full border-4 border-white bg-blue-600 shadow ring-2 ring-gray-300 transition hover:scale-110"></button>

    <button className="h-11 w-11 rounded-full border-4 border-white bg-green-600 shadow ring-2 ring-gray-300 transition hover:scale-110"></button>

  </div>

</div>

{/* Quantity */}

<div className="mt-8">

  <h3 className="mb-4 text-lg font-semibold text-[#2B2B2B]">
    Quantity
  </h3>

  <div className="flex w-fit items-center overflow-hidden rounded-xl border border-gray-300 bg-white">

    <button
      onClick={() =>
        setQuantity((q) => Math.max(1, q - 1))
      }
      className="flex h-12 w-12 items-center justify-center text-2xl font-semibold text-[#2B2B2B] transition hover:bg-gray-100"
    >
      −
    </button>

    <span className="flex h-12 w-16 items-center justify-center border-x border-gray-300 text-lg font-bold text-[#2B2B2B]">
      {quantity}
    </span>

    <button
      onClick={() =>
        setQuantity((q) =>
          Math.min(product.stock, q + 1)
        )
      }
      className="flex h-12 w-12 items-center justify-center text-2xl font-semibold text-[#2B2B2B] transition hover:bg-gray-100"
    >
      +
    </button>

  </div>

</div>

{/* Buttons */}

<div className="mt-10 flex flex-col gap-4">

  <button className="rounded-2xl bg-[#98691D] py-4 text-lg font-semibold text-white transition hover:bg-[#7E5619]">
    🛒 Add To Cart
  </button>

  <button className="rounded-2xl border-2 border-[#98691D] bg-white py-4 text-lg font-semibold text-[#98691D] transition hover:bg-[#98691D] hover:text-white">
    ⚡ Buy Now
  </button>

  <button className="rounded-2xl border border-gray-300 bg-white py-4 text-lg font-semibold text-[#2B2B2B] transition hover:bg-gray-100">
    ♡ Add To Wishlist
  </button>

</div>

{/* Features */}

<div className="mt-10 grid grid-cols-2 gap-4">

  <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center transition hover:shadow-md">

    <div className="text-3xl">
      🚚
    </div>

    <h4 className="mt-3 font-semibold text-[#2B2B2B]">
      Fast Delivery
    </h4>

    <p className="mt-1 text-sm text-gray-500">
      Nationwide Delivery
    </p>

  </div>

  <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center transition hover:shadow-md">

    <div className="text-3xl">
      💵
    </div>

    <h4 className="mt-3 font-semibold text-[#2B2B2B]">
      Cash On Delivery
    </h4>

    <p className="mt-1 text-sm text-gray-500">
      Pay After Delivery
    </p>

  </div>

  <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center transition hover:shadow-md">

    <div className="text-3xl">
      🔄
    </div>

    <h4 className="mt-3 font-semibold text-[#2B2B2B]">
      Easy Return
    </h4>

    <p className="mt-1 text-sm text-gray-500">
      7 Days Return Policy
    </p>

  </div>

  <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center transition hover:shadow-md">

    <div className="text-3xl">
      🔒
    </div>

    <h4 className="mt-3 font-semibold text-[#2B2B2B]">
      Secure Payment
    </h4>

    <p className="mt-1 text-sm text-gray-500">
      100% Secure Checkout
    </p>

  </div>

</div>

</div>

</div>

</div>

</section>

  );
}