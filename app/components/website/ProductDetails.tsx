"use client";

import { useEffect, useMemo, useState } from "react";
import { useCartFly } from "@/app/context/cart-fly-context";
import { getImageStartPosition } from "@/lib/fly";

import {
  getProductBySlug,
  getProductGallery,
  WebsiteProduct,
} from "@/lib/products";

import { addToCart } from "@/lib/cart";
import { getCurrentUser } from "@/lib/auth";

import ProductDetailsContent from "./ProductDetailsContent";

type GalleryImage = {
  id: string;
  image_url: string;
  sort_order: number;
};

type Props = {
  slug: string;
};

export default function ProductDetails({
  slug,
}: Props) {
  const [product, setProduct] =
    useState<WebsiteProduct | null>(null);

    const { startFly } = useCartFly();

  const [gallery, setGallery] =
    useState<GalleryImage[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [wishlist, setWishlist] =
    useState(false);

  const [quantity, setQuantity] =
    useState(1);

  const [selectedSize, setSelectedSize] =
    useState("");

  const [selectedColor, setSelectedColor] =
    useState("");

  useEffect(() => {
    loadProduct();
  }, [slug]);

  async function loadProduct() {
    setLoading(true);

    try {
      const data =
        await getProductBySlug(slug);

      if (!data) {
        setLoading(false);
        return;
      }

      setProduct(data);

      const images =
        await getProductGallery(
          data.id
        );

      setGallery(images);

      if (data.sizes?.length) {
        setSelectedSize(
          data.sizes[0].id
        );
      }

      if (data.colors?.length) {
        setSelectedColor(
          data.colors[0].id
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function increaseQuantity() {
    if (!product) return;

    setQuantity((q) =>
      Math.min(product.stock, q + 1)
    );
  }

  function decreaseQuantity() {
    setQuantity((q) =>
      Math.max(1, q - 1)
    );
  }

  async function handleAddToCart() {

  const user =
    await getCurrentUser();

  if (!user) {

    window.location.href =
      "/login?redirect=cart";

    return;

  }

  if (!product) return;

  if (product.stock <= 0) {
    alert("Out of stock.");
    return;
  }

  if (
    (product.sizes?.length ?? 0) > 0 &&
    !selectedSize
  ) {
    alert("Select size.");
    return;
  }

  if (
    (product.colors?.length ?? 0) > 0 &&
    !selectedColor
  ) {
    alert("Select color.");
    return;
  }

  const image = document.getElementById(
    "product-main-image"
  ) as HTMLImageElement | null;

  if (image) {
    const pos =
      getImageStartPosition(image);

    startFly({
      image: product.image_url || "",
      startX: pos.x,
      startY: pos.y,
    });
  }

  await addToCart({
    productId: product.id,
    quantity,
    sizeId: selectedSize || null,
    colorId: selectedColor || null,
  });

  window.dispatchEvent(
    new Event("cart-updated")
  );

  window.dispatchEvent(
    new Event("open-cart")
  );
}

    async function handleBuyNow() {

  const user =
    await getCurrentUser();

  if (!user) {

    window.location.href =
      "/login?redirect=checkout";

    return;

  }

  await handleAddToCart();

  window.location.href =
    "/checkout";

}

  function handleWishlist() {
    setWishlist((prev) => !prev);
  }

  async function handleShare() {
    if (!product) return;

    const url = `${window.location.origin}/product/${product.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.name,
          url,
        });

        return;
      } catch {}
    }

    await navigator.clipboard.writeText(url);

    alert("Product link copied.");
  }

  const galleryImages = useMemo(() => {
  if (!product) return [];

  if (gallery.length > 0) {
    return gallery;
  }

  return product.image_url
    ? [
        {
          id: "cover",
          image_url: product.image_url,
          sort_order: 0,
        },
      ]
    : [];
}, [product, gallery]);

  if (loading) {
    return (
      <section className="bg-[#F8F5EE]">

        <div className="mx-auto max-w-7xl px-4 py-20">

          <div className="grid gap-10 lg:grid-cols-[1fr_480px]">

            <div className="aspect-[4/5] animate-pulse rounded-3xl bg-white" />

            <div className="space-y-4">

              <div className="h-10 w-2/3 animate-pulse rounded-xl bg-white" />

              <div className="h-6 w-1/3 animate-pulse rounded-xl bg-white" />

              <div className="h-20 animate-pulse rounded-2xl bg-white" />

              <div className="h-16 animate-pulse rounded-2xl bg-white" />

              <div className="h-14 animate-pulse rounded-2xl bg-white" />

            </div>

          </div>

        </div>

      </section>
    );
  }

  if (!product) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-[#F8F5EE]">

        <h2 className="text-2xl font-bold text-[#2B2B2B]">
          Product not found
        </h2>

      </section>
    );
  }

    return (
    <ProductDetailsContent
      product={product}
      gallery={galleryImages}
      sizes={product.sizes ?? []}
      colors={product.colors ?? []}
      selectedSize={selectedSize}
      selectedColor={selectedColor}
      quantity={quantity}
      wishlist={wishlist}
      loading={loading}
      onIncrease={increaseQuantity}
      onDecrease={decreaseQuantity}
      onSizeChange={setSelectedSize}
      onColorChange={setSelectedColor}
      onAddToCart={handleAddToCart}
      onBuyNow={handleBuyNow}
      onWishlist={handleWishlist}
      onShare={handleShare}
    />
  );
}

// ===============================
// ProductDetails.tsx FINAL
// ===============================
//
// Features
//
// ✅ Data Loading
// ✅ Gallery Loading
// ✅ Size Selection
// ✅ Color Selection
// ✅ Quantity
// ✅ Add To Cart
// ✅ Buy Now
// ✅ Wishlist
// ✅ Share
// ✅ Loading Skeleton
// ✅ Product Not Found
// ✅ ProductDetailsContent Integration
//
// Ready For:
//
// ✅ Product Page
// ✅ Product Modal
// ✅ Fly Animation
// ✅ Cart Drawer
// ✅ Checkout
// ✅ Theme #98691D
//
// ===============================