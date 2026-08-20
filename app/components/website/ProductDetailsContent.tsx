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
      <div
        className="
          mx-auto
          w-full
          max-w-7xl
          px-4
          py-6
          sm:px-5
          sm:py-8
          lg:px-8
          lg:py-10
        "
      >
        {/* =====================================================
            TOP AREA
            LEFT  = MAIN IMAGE + GALLERY
            RIGHT = RELATED PRODUCTS
           ===================================================== */}

        <div
          className="
            grid
            w-full
            min-w-0
            items-stretch
            gap-6
            lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]
            lg:gap-7
          "
        >
          {/* ===================================================
              LEFT
              MAIN PRODUCT IMAGE + GALLERY
             =================================================== */}

          <div className="w-full min-w-0">
            <ProductGallery
              images={images}
              productName={product.name}
            />
          </div>

          {/* ===================================================
              RIGHT
              RELATED PRODUCTS
             =================================================== */}

          <div
            className="
              flex
              w-full
              min-w-0
              flex-col
              lg:h-full
            "
          >
            <RelatedProducts
              currentProduct={product}
            />
          </div>
        </div>

        {/* =====================================================
            FULL WIDTH PRODUCT INFORMATION
            BELOW IMAGE + RELATED PRODUCTS
           ===================================================== */}

        <div
          className="
            mt-7
            w-full
            min-w-0
            border-t
            border-[var(--theme-primary-border)]
            pt-7
            lg:mt-8
            lg:pt-8
          "
        >
          <div
            className="
              grid
              w-full
              min-w-0
              gap-6
              xl:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]
              xl:items-start
            "
          >
            {/* =================================================
                PRODUCT INFO
               ================================================= */}

            <div className="min-w-0">
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
            </div>

            {/* =================================================
                ACTIONS / SHARE / WISHLIST
               ================================================= */}

            <div className="min-w-0">
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
        </div>

        {/* =====================================================
            PRODUCT TABS
           ===================================================== */}

        <div
          className="
            mt-8
            w-full
            min-w-0
            lg:mt-10
          "
        >
          <ProductTabs
            description={product.description}
            specification={product.specification}
            reviews={reviews}
          />
        </div>
      </div>
    </section>
  );
}