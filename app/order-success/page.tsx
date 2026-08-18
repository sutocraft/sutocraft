"use client";

import Link from "next/link";
import { Suspense } from "react";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/app/components/website/settings.theme_color";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const { themeColor } = useTheme();

  const orderNumber =
    searchParams.get("order");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F5EE] px-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm sm:p-10">
        <div
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            backgroundColor:
              `${themeColor}15`,
          }}
        >
          <CheckCircle2
            size={48}
            style={{
              color: themeColor,
            }}
          />
        </div>

        <h1 className="mt-7 text-3xl font-bold text-gray-900">
          Order Placed Successfully!
        </h1>

        <p className="mt-3 text-gray-500">
          Thank you for your order. We have received
          your order successfully.
        </p>

        {orderNumber && (
          <div className="mt-6 rounded-2xl bg-gray-50 px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Order Number
            </p>

            <p
              className="mt-1 text-xl font-bold"
              style={{
                color: themeColor,
              }}
            >
              {orderNumber}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/product"
            className="rounded-xl px-6 py-3 font-semibold text-white"
            style={{
              backgroundColor: themeColor,
            }}
          >
            Continue Shopping
          </Link>

          <Link
            href="/account/orders"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <ShoppingBag size={18} />
            My Orders
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={null}>
      <OrderSuccessContent />
    </Suspense>
  );
}