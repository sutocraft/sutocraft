"use client";

import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductActions from "./ProductActions";
import ProductTabs from "./ProductTabs";

import type { WebsiteProduct } from "@/lib/products";
import RelatedProducts from "./RelatedProducts";


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



  selectedSize: string;



  quantity: number;

  wishlist?: boolean;

  loading?: boolean;

  onIncrease: () => void;

  onDecrease: () => void;

  onSizeChange: (id: string) => void;



  onAddToCart: () => void;

  onBuyNow: () => void;

  onWishlist: () => void;

  onShare: () => void;

  reviews?: any[];
};

export default function ProductDetailsContent({
  product,
  gallery,

  sizes,


  selectedSize,


  quantity,

  wishlist,
  loading,

  onIncrease,
  onDecrease,

  onSizeChange,


  onAddToCart,
  onBuyNow,
  onWishlist,
  onShare,
  reviews = [],
}: Props) {
  const images = [
    product.image_url,
    ...gallery.map((g) => g.image_url),
  ].filter(Boolean) as string[];

  return (
    <section className="bg-[var(--theme-background)]">

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
              
              selectedSize={selectedSize}
              
              quantity={quantity}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              onSizeChange={onSizeChange}
             
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

        <RelatedProducts currentProduct={product} />

      </div>

    </section>

    );
}