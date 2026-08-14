"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  ShoppingBag,
  Smartphone,
  Wallet,
} from "lucide-react";

import { getCartItems } from "@/lib/cart";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth";
import { placeOrder } from "@/lib/checkout";
import { useTheme } from "@/app/components/website/settings.theme_color";

type CartItem = {
  id: string;
  quantity: number;

  products: {
    id: string;
    name: string;
    price: number;
    sale_price: number | null;
    sku: string | null;
    slug: string;

    product_images: {
      image_url: string;
      is_primary: boolean;
    }[];
  };

  sizes: {
    id: string;
    name: string;
  } | null;

  colors: {
    id: string;
    name: string;
  } | null;
};

const PAYMENT_METHODS = [
  {
    value: "bKash",
    label: "bKash",
    description: "Mobile Banking",
    icon: Smartphone,
    logo: "bKash",
  },
  {
    value: "Nagad",
    label: "Nagad",
    description: "Mobile Banking",
    icon: Smartphone,
    logo: "Nagad",
  },
  {
    value: "Cash",
    label: "Cash",
    description: "Cash on Delivery",
    icon: Wallet,
    logo: undefined,
  },
  {
    value: "Card",
    label: "Card",
    description: "Debit / Credit Card",
    icon: CreditCard,
    logo: undefined,
  },
  {
    value: "Others",
    label: "Others",
    description: "Other payment method",
    icon: Wallet,
    logo: undefined,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { themeColor } = useTheme();

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [error, setError] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [transactionId, setTransactionId] = useState("");

  const [checkoutMode, setCheckoutMode] =
    useState<"cart" | "buy_now">("cart");

  async function loadCheckout() {
    try {
      setLoading(true);
      setError("");

      const user = await getCurrentUser();

      if (!user) {
        window.location.href = "/login?redirect=checkout";
        return;
      }

      /*
       * Checkout mode
       *
       * Support both:
       * "buy_now"
       * "buy-now"
       */
      const urlMode =
        new URLSearchParams(
          window.location.search
        ).get("mode");

      const mode =
        urlMode === "buy-now" ||
        urlMode === "buy_now"
          ? "buy_now"
          : "cart";

      setCheckoutMode(mode);

      /*
       * BUY NOW
       */
      if (mode === "buy_now") {
        const rawBuyNow =
          localStorage.getItem("sutocraft_buy_now");

        if (!rawBuyNow) {
          localStorage.removeItem(
            "sutocraft_checkout_mode"
          );

          setError(
            "Unable to load Buy Now product."
          );

          setItems([]);
        } else {
          try {
            const buyNowItem = JSON.parse(rawBuyNow);

            setItems([
              buyNowItem as CartItem,
            ]);
          } catch (err) {
            console.error(
              "Invalid Buy Now data:",
              err
            );

            localStorage.removeItem(
              "sutocraft_buy_now"
            );

            localStorage.removeItem(
              "sutocraft_checkout_mode"
            );

            setError(
              "Unable to load Buy Now product."
            );

            setItems([]);
          }
        }
      }

      /*
       * CART CHECKOUT
       */
      else {
        localStorage.removeItem(
          "sutocraft_buy_now"
        );

        const data = await getCartItems();

        setItems(data as CartItem[]);
      }

      /*
       * LOAD CUSTOMER PROFILE
       */
      try {
        const profile: any =
          await getCurrentProfile();

        const metadata: any =
          user.user_metadata || {};

        const fullName =
          profile?.full_name ||
          profile?.name ||
          metadata?.full_name ||
          metadata?.name ||
          "";

        const profilePhone =
          profile?.phone ||
          metadata?.phone ||
          "";

        const profileEmail =
          profile?.email ||
          user.email ||
          "";

        const addressParts = [
          profile?.address,
          profile?.area,
          profile?.upazila,
          profile?.city,
          profile?.district,
          profile?.division,
          profile?.postal_code,
        ].filter(
          (value, index, array) =>
            value &&
            array.indexOf(value) === index
        );

        setCustomerName(fullName);
        setPhone(profilePhone);
        setEmail(profileEmail);
        setAddress(
          addressParts.join(", ")
        );
      } catch (profileError) {
        console.error(
          "Unable to load customer profile:",
          profileError
        );

        setCustomerName(
          user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            ""
        );

        setPhone(
          user.user_metadata?.phone ||
            ""
        );

        setEmail(
          user.email || ""
        );
      }
    } catch (err: any) {
      console.error(err);

      setError(
        err?.message ||
          "Unable to load your checkout."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCheckout();
  }, []);

  /*
   * SUBTOTAL
   */
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const price =
        item.products?.sale_price ??
        item.products?.price ??
        0;

      return (
        sum +
        Number(price) *
          item.quantity
      );
    }, 0);
  }, [items]);

  const shipping = 0;

  const discount = 0;

  const total =
    subtotal +
    shipping -
    discount;

  const requiresTransactionId =
    paymentMethod === "bKash" ||
    paymentMethod === "Nagad" ||
    paymentMethod === "Card" ||
    paymentMethod === "Others";

  /*
   * PRODUCT IMAGE
   */
  function getImage(item: CartItem) {
    return (
      item.products?.image_url?.trim() ||
      item.products?.product_images?.find(
        (image) => image.is_primary
      )?.image_url ||
      item.products?.product_images?.[0]
        ?.image_url ||
      "/images/no-image.png"
    );
  }

  /*
   * PLACE ORDER
   */
  async function handlePlaceOrder() {
    try {
      setError("");

      if (items.length === 0) {
        setError(
          "Your cart is empty."
        );
        return;
      }

      if (!customerName.trim()) {
        setError(
          "Please enter your full name."
        );
        return;
      }

      if (!phone.trim()) {
        setError(
          "Please enter your phone number."
        );
        return;
      }

      if (!address.trim()) {
        setError(
          "Please enter your delivery address."
        );
        return;
      }

      if (
        requiresTransactionId &&
        !transactionId.trim()
      ) {
        setError(
          "Please enter the transaction ID."
        );
        return;
      }

      setPlacingOrder(true);

      const order =
        await placeOrder({
          customer_name:
            customerName.trim(),

          phone:
            phone.trim(),

          email:
            email.trim() || "",

          address:
            address.trim(),

          subtotal,

          shipping,

          total,

          discount,

          payment_method:
            paymentMethod,

          transaction_id:
            transactionId.trim() ||
            null,

          shipping_method:
            "Standard",

          shipping_charge:
            shipping,

          clear_cart:
            checkoutMode === "cart",

          items: items.map(
            (item) => {
              const price =
                Number(
                  item.products
                    ?.sale_price ??
                    item.products
                      ?.price ??
                    0
                );

              return {
                cart_item_id:
                  checkoutMode ===
                  "cart"
                    ? item.id
                    : undefined,

                product_id:
                  item.products.id,

                product_name:
                  item.products.name,

                sku:
                  item.products.sku,

                size_id:
                  item.sizes?.id ||
                  null,

                color_id:
                  item.colors?.id ||
                  null,

                quantity:
                  item.quantity,

                price,

                discount: 0,
              };
            }
          ),
        });

      /*
       * ORDER SUCCESS
       */
      localStorage.removeItem(
        "sutocraft_buy_now"
      );

      localStorage.removeItem(
        "sutocraft_checkout_mode"
      );

      router.push(
        `/order-success?order=${encodeURIComponent(
          order.order_number ||
            order.id
        )}`
      );
    } catch (err: any) {
      console.error(
        "Place order error:",
        err
      );

      setError(
        err?.message ||
          "Unable to place order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  }

  /*
   * LOADING
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F5EE]">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
          <div className="text-center">
            <div
              className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200"
              style={{
                borderTopColor:
                  themeColor,
              }}
            />

            <p className="mt-4 text-sm text-gray-600">
              Loading checkout...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * EMPTY
   */
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#F8F5EE]">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full"
            style={{
              backgroundColor:
                `${themeColor}15`,
            }}
          >
            <ShoppingBag
              size={44}
              style={{
                color: themeColor,
              }}
            />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            Your cart is empty
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            {error ||
              "Add some products before proceeding to checkout."}
          </p>

          <Link
            href="/products"
            className="mt-6 rounded-xl px-7 py-3 font-semibold text-white"
            style={{
              backgroundColor:
                themeColor,
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5EE]">
      {/* HEADER */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            <ArrowLeft size={17} />
            Continue Shopping
          </Link>

          <div className="mt-5 flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{
                backgroundColor:
                  `${themeColor}15`,
              }}
            >
              <Package
                size={23}
                style={{
                  color: themeColor,
                }}
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Checkout
              </h1>

              <p className="mt-1 text-sm text-gray-600">
                Complete your order details
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_390px]">
          {/* LEFT */}
          <div className="space-y-6">

            {/* DELIVERY INFORMATION */}
            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor:
                      `${themeColor}15`,
                  }}
                >
                  <MapPin
                    size={20}
                    style={{
                      color: themeColor,
                    }}
                  />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Delivery Information
                  </h2>

                  <p className="text-sm text-gray-600">
                    Where should we deliver your order?
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">

                {/* NAME */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-bold text-gray-900">
                    Full Name *
                  </label>

                  <input
                    value={customerName}
                    onChange={(e) =>
                      setCustomerName(
                        e.target.value
                      )
                    }
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-900">
                    Phone *
                  </label>

                  <input
                    value={phone}
                    onChange={(e) =>
                      setPhone(
                        e.target.value
                      )
                    }
                    placeholder="01XXXXXXXXX"
                    type="tel"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-900">
                    Email
                  </label>

                  <input
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    placeholder="you@example.com"
                    type="email"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                  />
                </div>

                {/* ADDRESS */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-bold text-gray-900">
                    Delivery Address *
                  </label>

                  <textarea
                    value={address}
                    onChange={(e) =>
                      setAddress(
                        e.target.value
                      )
                    }
                    placeholder="House, Road, Area, District..."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor:
                      `${themeColor}15`,
                  }}
                >
                  <CreditCard
                    size={20}
                    style={{
                      color: themeColor,
                    }}
                  />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Payment Method
                  </h2>

                  <p className="text-sm text-gray-600">
                    Select how you want to pay
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {PAYMENT_METHODS.map(
                  (method) => {
                    const Icon =
                      method.icon;

                    const selected =
                      paymentMethod ===
                      method.value;

                    return (
                      <button
                        key={
                          method.value
                        }
                        type="button"
                        onClick={() => {
                          setPaymentMethod(
                            method.value
                          );

                          setTransactionId(
                            ""
                          );
                        }}
                        className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                          selected
                            ? "shadow-sm"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        style={
                          selected
                            ? {
                                borderColor:
                                  themeColor,
                                backgroundColor:
                                  `${themeColor}08`,
                              }
                            : undefined
                        }
                      >
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                          style={{
                            backgroundColor:
                              selected
                                ? `${themeColor}18`
                                : "#F3F4F6",
                          }}
                        >
                          {method.logo ? (
                            <span
                              className="text-[11px] font-extrabold tracking-tight"
                              style={{
                                color:
                                  selected
                                    ? themeColor
                                    : "#374151",
                              }}
                            >
                              {
                                method.logo
                              }
                            </span>
                          ) : (
                            <Icon
                              size={19}
                              style={{
                                color:
                                  selected
                                    ? themeColor
                                    : "#374151",
                              }}
                            />
                          )}
                        </div>

                        <div className="flex-1">
                          <p className="font-bold text-gray-900">
                            {
                              method.label
                            }
                          </p>

                          <p className="text-xs font-medium text-gray-600">
                            {
                              method.description
                            }
                          </p>
                        </div>

                        {selected && (
                          <CheckCircle2
                            size={20}
                            style={{
                              color:
                                themeColor,
                            }}
                          />
                        )}
                      </button>
                    );
                  }
                )}
              </div>

              {/* TRANSACTION ID */}
              {requiresTransactionId && (
                <div className="mt-5">
                  <label className="mb-2 block text-sm font-bold text-gray-900">
                    Transaction ID *
                  </label>

                  <input
                    value={transactionId}
                    onChange={(e) =>
                      setTransactionId(
                        e.target.value
                      )
                    }
                    placeholder="Enter payment transaction ID"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                  />

                  <p className="mt-2 text-xs font-medium text-gray-500">
                    Enter the transaction/reference number from your payment.
                  </p>
                </div>
              )}

              {/* CASH MESSAGE */}
              {paymentMethod ===
                "Cash" && (
                <div className="mt-5 rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                  Cash payment will be collected according to the delivery/payment process.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">

              <h2 className="text-xl font-bold text-gray-900">
                Order Summary
              </h2>

              {/* ITEMS */}
              <div className="mt-5 max-h-[360px] space-y-4 overflow-y-auto pr-1">
                {items.map((item) => {
                  const price =
                    Number(
                      item.products
                        ?.sale_price ??
                        item.products
                          ?.price ??
                        0
                    );

                  return (
                    <div
                      key={item.id}
                      className="flex gap-3"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={getImage(
                            item
                          )}
                          alt={
                            item.products
                              .name
                          }
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-bold text-gray-900">
                          {
                            item.products
                              .name
                          }
                        </p>

                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-gray-600">
                          <span>
                            Qty:{" "}
                            {
                              item.quantity
                            }
                          </span>

                          {item.sizes && (
                            <span>
                              Size:{" "}
                              {
                                item.sizes
                                  .name
                              }
                            </span>
                          )}

                          {item.colors && (
                            <span>
                              Color:{" "}
                              {
                                item.colors
                                  .name
                              }
                            </span>
                          )}
                        </div>

                        <p
                          className="mt-1 text-sm font-bold"
                          style={{
                            color:
                              themeColor,
                          }}
                        >
                          ৳{" "}
                          {(
                            price *
                            item.quantity
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="my-5 border-t border-gray-200" />

              {/* TOTAL DETAILS */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-600">
                    Subtotal
                  </span>

                  <span className="font-bold text-gray-900">
                    ৳{" "}
                    {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-600">
                    Discount
                  </span>

                  <span className="font-bold text-gray-900">
                    ৳{" "}
                    {discount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-600">
                    Shipping
                  </span>

                  <span className="font-bold text-gray-900">
                    {shipping === 0
                      ? "Free"
                      : `৳ ${Number(
                          shipping
                        ).toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div className="my-5 border-t border-gray-200" />

              {/* GRAND TOTAL */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  Total
                </span>

                <span
                  className="text-2xl font-bold"
                  style={{
                    color:
                      themeColor,
                  }}
                >
                  ৳{" "}
                  {Number(
                    total
                  ).toLocaleString()}
                </span>
              </div>

              {/* PLACE ORDER */}
              <button
                type="button"
                onClick={
                  handlePlaceOrder
                }
                disabled={
                  placingOrder
                }
                className="mt-6 flex w-full items-center justify-center rounded-xl py-3.5 font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundColor:
                    themeColor,
                }}
              >
                {placingOrder
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

              <p className="mt-4 text-center text-xs font-medium leading-relaxed text-gray-500">
                By placing this order, you confirm that the information provided is correct.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}