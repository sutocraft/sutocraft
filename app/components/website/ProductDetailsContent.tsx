"use client";

import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductActions from "./ProductActions";
import ProductTabs from "./ProductTabs";

import type { WebsiteProduct } from "@/lib/products";


type GalleryImage = {
  id: string;
  image_url: string;
};

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

  gallery: GalleryImage[];

  sizes: Size[];

  colors: Color[];

  selectedSize: string;

  selectedColor: string;

  quantity: number;

  wishlist?: boolean;

  loading?: boolean;

  onIncrease: () => void;

  onDecrease: () => void;

  onSizeChange: (id: string) => void;

  onColorChange: (id: string) => void;

  onAddToCart: () => void;

  onBuyNow: () => void;

  onWishlist: () => void;

  onShare: () => void;
};

export default function ProductDetailsContent({
  product,
  gallery,

  sizes,
  colors,

  selectedSize,
  selectedColor,

  quantity,

  wishlist,
  loading,

  onIncrease,
  onDecrease,

  onSizeChange,
  onColorChange,

  onAddToCart,
  onBuyNow,
  onWishlist,
  onShare,
}: Props) {
  const images = [
    product.image_url,
    ...gallery.map((g) => g.image_url),
  ].filter(Boolean) as string[];

  return (
    <section className="bg-[#F8F5EE]">

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">

        <div className="grid gap-10 lg:grid-cols-[1fr_480px]">

          {/* Gallery */}

          <ProductGallery
            images={images}
            productName={product.name}
          />

                    {/* Right Side */}

          <div className="flex flex-col">

            <ProductInfo
              product={product}
              sizes={sizes}
              colors={colors}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              quantity={quantity}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              onSizeChange={onSizeChange}
              onColorChange={onColorChange}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
            />

            <ProductActions
              inStock={product.stock > 0}
              loading={loading}
              wishlist={wishlist}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              onWishlist={onWishlist}
              onShare={onShare}
            />

          </div>

        </div>

        {/* Product Tabs */}

        <div className="mt-14">

          <ProductTabs
            description={product.description}
            specification={product.specification}
            reviews={[]}
          />

        </div>

      </div>

    </section>

    );
}