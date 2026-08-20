"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { submitProductReview } from "@/lib/reviews";

type Props = {
  open: boolean;
  order: any;
  item: any;
  themeColor: string;
  onClose: () => void;
  onSubmitted?: () => void;
};

export default function ReviewModal({
  open,
  order,
  item,
  themeColor,
  onClose,
  onSubmitted,
}: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  if (!open || !item) return null;

  async function submit() {
    try {
      setBusy(true);
      setMessage("");

      await submitProductReview({
        orderId: order.id,
        productId: item.product_id || item.product?.id,
        sku: item.sku,
        rating,
        comment,
      });

      setMessage("Review submitted successfully.");
      window.dispatchEvent(new Event("product-reviews-updated"));
      onSubmitted?.();

      setTimeout(onClose, 700);
    } catch (error: any) {
      setMessage(error?.message || "Unable to submit review.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#183153]">Review Product</h3>
            <p className="mt-1 text-sm text-gray-500">
              {item.product_name || "Product"} · SKU: {item.sku || "-"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-6 text-sm font-semibold text-[#183153]">Your Rating</p>

        <div className="mt-3 flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="transition-transform hover:scale-110"
              aria-label={`${value} stars`}
            >
              <Star
                size={30}
                fill={value <= rating ? themeColor : "transparent"}
                color={value <= rating ? themeColor : "#CBD5E1"}
              />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          placeholder="Write your review..."
          disabled={busy}
          className="mt-5 w-full resize-none rounded-2xl border border-[#DCCEB6] p-4 text-sm outline-none focus:border-[#A8741A]"
        />

        {message && (
          <div className="mt-4 rounded-xl bg-[#F8F4EC] px-4 py-3 text-sm text-[#183153]">
            {message}
          </div>
        )}

        <button
          type="button"
          onClick={submit}
          disabled={busy || !comment.trim()}
          className="mt-5 w-full rounded-xl px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: themeColor }}
        >
          {busy ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
}
