"use client";

import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductActions from "./ProductActions";
import ProductTabs from "./ProductTabs";
import RelatedProducts from "./RelatedProducts";

import type { WebsiteProduct } from "@/lib/products";

type GalleryImage = {
  id: string;
  image_url: string;
};

type Size = {
  id: string;
  name: string;
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
  /*
   * Build gallery list.
   *
   * Main product image stays first.
   * Gallery images follow after it.
   */
  const images = [
    product.image_url,
    ...gallery.map((g) => g.image_url),
  ].filter(Boolean) as string[];

  return (
    <section className="w-full bg-[var(--theme-background)]">
      <div
        className="
          mx-auto
          w-full
          max-w-7xl
          px-4
          py-6
          sm:px-5
          sm:py-8
          lg:px-7
          lg:py-8
        "
      >
        {/* =====================================================
            TOP SECTION
            Desktop:
            Left  = Main Image + Gallery
            Right = Related Products 2 x 2
            Mobile:
            One column
        ===================================================== */}

        <div
          className="
            grid
            w-full
            min-w-0
            grid-cols-1
            gap-6
            lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]
            lg:items-start
            lg:gap-7
          "
        >
          {/* =================================================
              LEFT
              Main Product Image + Gallery
          ================================================= */}

          <div className="w-full min-w-0 lg:pt-15">
  <ProductGallery
    images={images}
    productName={product.name}
  />
</div>

          {/* =================================================
              RIGHT
              Related Products
          ================================================= */}

          <div className="w-full min-w-0">
            <RelatedProducts
              currentProduct={product}
            />
          </div>
        </div>

        {/* =====================================================
            FULL WIDTH PRODUCT INFORMATION

            This intentionally comes AFTER the top two-column
            section.

            Therefore ProductInfo no longer becomes a right-side
            sidebar.
        ===================================================== */}

        <div
          className="
            mt-7
            w-full
            min-w-0
            border-t
            pt-7
          "
          style={{
            borderColor:
              "var(--theme-primary-border)",
          }}
        >
          {/* =================================================
              PRODUCT INFORMATION
              Full Width
          ================================================= */}

          <div className="w-full min-w-0">
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
              PRODUCT ACTIONS
              Full Width
          ================================================= */}

          <div className="mt-6 w-full min-w-0">
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

        {/* =====================================================
            PRODUCT TABS
            Description / Specification / Reviews
            Full Width
        ===================================================== */}

        <div
          className="
            mt-7
            w-full
            min-w-0
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