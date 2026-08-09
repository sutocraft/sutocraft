"use client";

import { useEffect, useState } from "react";
import {
  addToWishlist,
  removeFromWishlist,
  isWishlisted,
} from "@/lib/wishlist";

type WishlistButtonProps = {
  productId: string;
};

export default function WishlistButton({
  productId,
}: WishlistButtonProps) {
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    checkWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  async function checkWishlist() {
    try {
      const exists = await isWishlisted(productId);
      setWishlisted(exists);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleClick() {
    if (loading) return;

    try {
      setLoading(true);

      if (wishlisted) {
        await removeFromWishlist(productId);
        setWishlisted(false);
      } else {
        await addToWishlist(productId);
        setWishlisted(true);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      className={`
        w-10
        h-10
        rounded-full
        border
        flex
        items-center
        justify-center
        transition
        duration-200
        ${
          wishlisted
            ? "bg-red-500 border-red-500 text-white"
            : "bg-white border-[var(--theme-primary-border)] text-gray-500 hover:bg-red-50 hover:text-red-500"
        }
      `}
    >
      {loading ? (
        <span className="text-xs">...</span>
      ) : (
        <span className="text-lg">
          {wishlisted ? "♥" : "♡"}
        </span>
      )}
    </button>
  );
}