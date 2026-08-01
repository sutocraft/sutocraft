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

  useEffect(() => {
    loadProduct();
  }, [slug]);

  async function loadProduct() {
    const data = await getProductBySlug(slug);

console.log("Loaded =", data);

    if (!data) return;

    setProduct(data);

    setSelectedImage(data.image_url || "");

    const images = await getProductGallery(
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
console.log({
  product,
  gallery,
  selectedImage,
});
  return (
  <section className="bg-[#F8F5EE] py-12">
    <div className="mx-auto max-w-7xl px-4">

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

        {/* LEFT */}

<div className="flex gap-4">

  <div className="flex flex-col gap-3">

    <button
      onClick={() =>
        setSelectedImage(product.image_url || "")
      }
      className={`overflow-hidden rounded-xl border-2 ${
        selectedImage === product.image_url
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
          setSelectedImage(img.image_url)
        }
        className={`overflow-hidden rounded-xl border-2 ${
          selectedImage === img.image_url
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

    {product.discount_percentage > 0 && (
      <span className="absolute left-5 top-16 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
        -{product.discount_percentage}%
      </span>
    )}

    <img
      src={selectedImage || product.image_url || ""}
      alt={product.name}
      className="h-[600px] w-full object-contain"
    />

  </div>

</div>

        {/* RIGHT */}

<div className="space-y-6">

  <h1 className="text-4xl font-bold text-gray-900">
    {product.name}
  </h1>

  <div className="flex items-center gap-3">

    <span className="text-4xl font-bold text-[#98691D]">
      ৳{product.sale_price ?? product.price}
    </span>

    {product.sale_price && (
      <span className="text-2xl text-gray-400 line-through">
        ৳{product.price}
      </span>
    )}

  </div>

  {/* Rating */}

<div className="mt-4 flex items-center gap-2">

  <div className="text-yellow-500 text-lg">
    ★★★★★
  </div>

  <span className="text-sm text-gray-500">
    (24 Reviews)
  </span>

</div>

{/* Price */}

<div className="mt-4 flex items-center gap-3">

  <span className="text-5xl font-bold text-[#98691D]">
    ৳{product.sale_price ?? product.price}
  </span>

  {product.sale_price && (
    <span className="text-3xl text-gray-400 line-through">
      ৳{product.price}
    </span>
  )}

</div>

{/* Discount */}

{product.discount_percentage > 0 && (

  <div className="mt-2">

    <span className="rounded bg-red-600 px-3 py-1 text-sm font-semibold text-white">
      {product.discount_percentage}% OFF
    </span>

  </div>

)}

{/* Stock */}

<div className="mt-5">

  <span
    className={`rounded-full px-3 py-1 text-sm font-semibold ${
      product.stock > 0
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {product.stock > 0 ? "In Stock" : "Out of Stock"}
  </span>

</div>

{/* Description */}

<p className="mt-6 text-gray-700 leading-7">
  {product.short_description}
</p>

{/* Product Info */}

<div className="mt-8 space-y-3 text-sm">

  <div className="flex">

    <span className="w-32 font-semibold">
      SKU
    </span>

    <span>{product.sku}</span>

  </div>

  <div className="flex">

    <span className="w-32 font-semibold">
      Brand
    </span>

    <span>{product.brand_name}</span>

  </div>

  <div className="flex">

    <span className="w-32 font-semibold">
      Category
    </span>

    <span>{product.category_name}</span>

  </div>

  <div className="flex">

    <span className="w-32 font-semibold">
      Sub Category
    </span>

    <span>{product.sub_category_name}</span>

  </div>

</div>

</div>

      </div>

    </div>
  </section>
);
}