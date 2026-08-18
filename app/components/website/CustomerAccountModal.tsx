"use client";

import Image from "next/image";
import React, {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";
import {
  ArrowLeft,
  Heart,
  KeyRound,
  MapPin,
  Package,
  UserRound,
  X,
} from "lucide-react";
import { getOrders, getOrderById } from "@/lib/orders";
import { getWishlist, removeFromWishlist } from "@/lib/wishlist";
import {
  getCurrentProfile,
  supabase,
  updateCurrentProfile,
  uploadAvatar,
} from "@/lib/auth";
import AddressSelector from "@/app/components/website/AddressSelector";
import { useTheme } from "@/app/components/website/settings.theme_color";

type View =
  | "dashboard"
  | "orders"
  | "wishlist"
  | "addresses"
  | "profile"
  | "password";

type Props = {
  profile: any;
  initialView?: View;
  onClose: () => void;
  onLogout: () => void;
};

type Order = {
  id: string;
  order_number: string | null;
  created_at: string;
  total: number | null;
  status: string;
  payment_status: string | null;
  payment_method: string | null;
};

export default function CustomerAccountModal({
  profile: initialProfile,
  initialView = "dashboard",
  onClose,
}: Props) {
  const { themeColor } = useTheme();
  const [view, setView] = useState<View>(initialView);
  const [profile, setProfile] = useState<any>(initialProfile);

  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  async function refreshProfile() {
    try {
      const data = await getCurrentProfile();
      if (data) setProfile(data);
    } catch (error) {
      console.error("Failed to refresh customer profile:", error);
    }
  }

  const titleMap: Record<View, string> = {
    dashboard: "My Account",
    orders: "My Orders",
    wishlist: "Wishlist",
    addresses: "My Addresses",
    profile: "My Profile",
    password: "Change Password",
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      <button
        type="button"
        aria-label="Close account popup"
        onClick={onClose}
        className="fixed inset-0 z-[120] bg-black/45 backdrop-blur-[2px]"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-label={titleMap[view]}
        className="fixed left-1/2 top-1/2 z-[130] flex max-h-[92vh] w-[calc(100%-24px)] max-w-6xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-[#E7D8BC] bg-[#F8F4EC] shadow-2xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#E7D8BC] bg-white px-5 py-4 sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            {view !== "dashboard" && (
              <button
                type="button"
                onClick={() => setView("dashboard")}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#DCCEB6] text-[#183153] transition hover:bg-[#F8F4EC]"
                aria-label="Back to account dashboard"
              >
                <ArrowLeft size={19} />
              </button>
            )}

            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-[#183153] sm:text-2xl">
                {titleMap[view]}
              </h2>
              {profile?.full_name && view !== "dashboard" && (
                <p className="truncate text-xs text-gray-500">
                  {profile.full_name}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#DCCEB6] text-[#183153] transition hover:bg-[#F8F4EC]"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-7">
          {view === "dashboard" && (
            <DashboardView
              profile={profile}
              themeColor={themeColor}
              onNavigate={setView}
            />
          )}

          {view === "orders" && <OrdersView themeColor={themeColor} />}

          {view === "wishlist" && (
            <WishlistView themeColor={themeColor} />
          )}

          {view === "addresses" && (
            <AddressesView
              profile={profile}
              themeColor={themeColor}
              onEdit={() => setView("profile")}
            />
          )}

          {view === "profile" && (
            <ProfileView
              profile={profile}
              themeColor={themeColor}
              onSaved={async () => {
                await refreshProfile();
              }}
            />
          )}

          {view === "password" && (
            <PasswordView themeColor={themeColor} onSuccess={onClose} />
          )}
        </div>
      </section>
    </>,
    document.body
  );
}

function DashboardView({
  profile,
  themeColor,
  onNavigate,
}: {
  profile: any;
  themeColor: string;
  onNavigate: (view: View) => void;
}) {
  const cards: Array<{
    key: View;
    title: string;
    text: string;
    icon: React.ReactNode;
  }> = [
    {
      key: "orders",
      title: "My Orders",
      text: "View your order history and current order status.",
      icon: <Package size={22} />,
    },
    {
      key: "wishlist",
      title: "Wishlist",
      text: "Products you have saved for later.",
      icon: <Heart size={22} />,
    },
    {
      key: "addresses",
      title: "Addresses",
      text: "Manage your saved delivery address.",
      icon: <MapPin size={22} />,
    },
    {
      key: "profile",
      title: "Profile",
      text: "Edit your customer profile and delivery details.",
      icon: <UserRound size={22} />,
    },
    {
      key: "password",
      title: "Change Password",
      text: "Update your account password securely.",
      icon: <KeyRound size={22} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#E7D8BC] bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {profile?.avatar ? (
            <Image
              src={profile.avatar}
              alt={profile?.full_name || "Avatar"}
              width={86}
              height={86}
              className="h-[86px] w-[86px] shrink-0 rounded-full border border-[#DCCEB6] object-cover"
            />
          ) : (
            <div className="flex h-[86px] w-[86px] shrink-0 items-center justify-center rounded-full border border-[#DCCEB6] bg-[#EEF2F7] text-3xl font-bold text-[#183153]">
              {profile?.full_name?.charAt(0) || <UserRound size={30} />}
            </div>
          )}

          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A8741A]">
              Welcome back
            </p>
            <h3 className="mt-1 truncate text-2xl font-bold text-[#183153] sm:text-3xl">
              {profile?.full_name || "Customer"}
            </h3>
            <p className="mt-1 truncate text-sm text-gray-500">
              {profile?.email || ""}
            </p>
            {profile?.phone && (
              <p className="mt-1 text-sm font-medium text-[#183153]">
                {profile.phone}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <button
            key={card.key}
            type="button"
            onClick={() => onNavigate(card.key)}
            className="group rounded-2xl border border-[#E7D8BC] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: themeColor }}
            >
              {card.icon}
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#183153]">
              {card.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              {card.text}
            </p>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-[#E7D8BC] bg-white p-5 shadow-sm sm:p-7">
        <h3 className="text-xl font-bold text-[#183153]">
          Account Information
        </h3>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Info label="Full Name" value={profile?.full_name} />
          <Info label="Email" value={profile?.email} />
          <Info label="Phone" value={profile?.phone} />
          <Info label="Role" value={profile?.role || "Customer"} />
        </div>
      </div>
    </div>
  );
}

function OrdersView({ themeColor }: { themeColor: string }) {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const data = await getOrders();

        if (active) {
          setOrders((data || []) as Order[]);
        }
      } catch (err: any) {
        console.error("Failed to load your orders:", err);

        if (active) {
          setError(
            err?.message ||
              "Unable to load your orders."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return orders;

    return orders.filter((order) => {
      const number =
        order.order_number ||
        order.id ||
        "";

      return (
        number.toLowerCase().includes(keyword) ||
        String(order.status || "")
          .toLowerCase()
          .includes(keyword) ||
        String(order.payment_method || "")
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [orders, search]);

  async function handleViewDetails(orderId: string) {
    try {
      setDetailsError("");
      setDetailsLoading(true);
      setExpandedOrder(orderId);
      setSelectedOrder(null);

      const data = await getOrderById(orderId);

      if (!data) {
        throw new Error(
          "Order details could not be found."
        );
      }

      setSelectedOrder(data);
    } catch (err: any) {
      console.error(
        "Failed to load order details:",
        err
      );

      setDetailsError(
        err?.message ||
          "Unable to load order details."
      );
    } finally {
      setDetailsLoading(false);
    }
  }

  function closeDetails() {
    setExpandedOrder(null);
    setSelectedOrder(null);
    setDetailsError("");
  }

  return (
    <div>
      {/* HEADER */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-2xl font-bold text-[#183153]">
            My Orders
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            View your order history and current
            order status.
          </p>
        </div>

        <div className="text-sm text-gray-500">
          Total Orders:
          <span
            className="ml-2 font-bold"
            style={{ color: themeColor }}
          >
            {filteredOrders.length}
          </span>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-5 rounded-2xl border border-[#E7D8BC] bg-white p-4">
        <input
          type="text"
          placeholder="Search Order Number..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full rounded-xl border border-[#DCCEB6] px-4 py-3 text-[#183153] outline-none focus:border-[#A8741A] sm:max-w-sm"
        />
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <PanelMessage
          text="Loading your orders..."
        />
      ) : filteredOrders.length === 0 ? (
        <PanelMessage
          title="No Orders Yet"
          text="You haven't placed any order yet."
          action="Start Shopping"
          href="/products"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E7D8BC] bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#F8F4EC] text-left text-[#183153]">
                <tr>
                  <th className="px-4 py-3 font-semibold">
                    Order
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Date
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Total
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Status
                  </th>

                  <th className="px-4 py-3 text-right font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => {
  const expanded =
    expandedOrder === order.id;

  return (
    <React.Fragment key={order.id}>
                      <tr className="border-t border-[#EFE5D5]">
                        <td className="px-4 py-4 font-semibold text-[#183153]">
                          {order.order_number ||
                            order.id}
                        </td>

                        <td className="px-4 py-4 text-gray-600">
                          {formatDate(
                            order.created_at
                          )}
                        </td>

                        <td className="px-4 py-4 font-semibold">
                          <span
                            style={{
                              color: themeColor,
                            }}
                          >
                            ৳
                            {Number(
                              order.total || 0
                            ).toLocaleString(
                              "en-BD"
                            )}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="rounded-full bg-[#F8F4EC] px-3 py-1 text-xs font-semibold text-[#183153]">
                            {order.status}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              expanded
                                ? closeDetails()
                                : handleViewDetails(
                                    order.id
                                  )
                            }
                            className="rounded-xl border px-4 py-2 text-sm font-semibold transition"
                            style={{
                              borderColor:
                                themeColor,
                              color: themeColor,
                            }}
                          >
                            {expanded
                              ? "Hide Details"
                              : "View Details"}
                          </button>
                        </td>
                      </tr>

                      {expanded && (
                        <tr>
                          <td
                            colSpan={5}
                            className="border-t border-[#E7D8BC] bg-[#FCFAF6] p-4 sm:p-6"
                          >
                            {detailsLoading ? (
                              <div className="py-10 text-center">
                                <div
                                  className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200"
                                  style={{
                                    borderTopColor:
                                      themeColor,
                                  }}
                                />

                                <p className="mt-3 text-sm text-gray-500">
                                  Loading order details...
                                </p>
                              </div>
                            ) : detailsError ? (
                              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {detailsError}
                              </div>
                            ) : selectedOrder ? (
                              <div className="space-y-5">

                                {/* ORDER SUMMARY */}
                                <div className="rounded-xl border border-[#E7D8BC] bg-white p-5">
                                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                      <h4
                                        className="text-lg font-bold"
                                        style={{
                                          color:
                                            themeColor,
                                        }}
                                      >
                                        Order Details
                                      </h4>

                                      <p className="mt-1 text-sm text-gray-500">
                                        {selectedOrder.order_number ||
                                          selectedOrder.id}
                                      </p>
                                    </div>

                                    <span className="w-fit rounded-full bg-[#F8F4EC] px-4 py-2 text-xs font-semibold text-[#183153]">
                                      {selectedOrder.status}
                                    </span>
                                  </div>
                                </div>

                                {/* CUSTOMER + PAYMENT */}
                                <div className="grid gap-5 lg:grid-cols-2">

                                  {/* CUSTOMER */}
                                  <div className="rounded-xl border border-[#E7D8BC] bg-white p-5">
                                    <h4
                                      className="font-bold"
                                      style={{
                                        color:
                                          themeColor,
                                      }}
                                    >
                                      Delivery Information
                                    </h4>

                                    <div className="mt-4 space-y-2 text-sm text-[#183153]">
                                      <p>
                                        <strong>
                                          Name:
                                        </strong>{" "}
                                        {selectedOrder.customer_name ||
                                          "-"}
                                      </p>

                                      <p>
                                        <strong>
                                          Phone:
                                        </strong>{" "}
                                        {selectedOrder.phone ||
                                          "-"}
                                      </p>

                                      {selectedOrder.email && (
                                        <p>
                                          <strong>
                                            Email:
                                          </strong>{" "}
                                          {
                                            selectedOrder.email
                                          }
                                        </p>
                                      )}

                                      <p>
                                        <strong>
                                          Address:
                                        </strong>{" "}
                                        {
                                          selectedOrder.address ||
                                          "-"
                                        }
                                      </p>

                                      <p>
                                        <strong>
                                          Shipping:
                                        </strong>{" "}
                                        {
                                          selectedOrder.shipping_method ||
                                          "Standard"
                                        }
                                      </p>
                                    </div>
                                  </div>

                                  {/* PAYMENT */}
                                  <div className="rounded-xl border border-[#E7D8BC] bg-white p-5">
                                    <h4
                                      className="font-bold"
                                      style={{
                                        color:
                                          themeColor,
                                      }}
                                    >
                                      Payment Information
                                    </h4>

                                    <div className="mt-4 space-y-2 text-sm text-[#183153]">
                                      <p>
                                        <strong>
                                          Method:
                                        </strong>{" "}
                                        {
                                          selectedOrder
                                            .payment
                                            ?.payment_method ||
                                          selectedOrder.payment_method ||
                                          "-"
                                        }
                                      </p>

                                      <p>
                                        <strong>
                                          Payment Status:
                                        </strong>{" "}
                                        {
                                          selectedOrder
                                            .payment
                                            ?.status ||
                                          selectedOrder.payment_status ||
                                          "Pending"
                                        }
                                      </p>

                                      {selectedOrder
                                        .payment
                                        ?.transaction_id && (
                                        <p>
                                          <strong>
                                            Transaction ID:
                                          </strong>{" "}
                                          {
                                            selectedOrder
                                              .payment
                                              .transaction_id
                                          }
                                        </p>
                                      )}

                                      <p>
                                        <strong>
                                          Amount:
                                        </strong>{" "}
                                        ৳
                                        {Number(
                                          selectedOrder
                                            .payment
                                            ?.amount ??
                                            selectedOrder.total ??
                                            0
                                        ).toLocaleString(
                                          "en-BD"
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* PRODUCTS */}
                                <div className="rounded-xl border border-[#E7D8BC] bg-white p-5">
                                  <h4
                                    className="font-bold"
                                    style={{
                                      color:
                                        themeColor,
                                    }}
                                  >
                                    Ordered Products
                                  </h4>

                                  <div className="mt-4 space-y-3">
                                    {(
                                      selectedOrder.items ||
                                      []
                                    ).map(
                                      (
                                        item: any,
                                        index: number
                                      ) => (
                                        <div
                                          key={
                                            item.id ||
                                            `${selectedOrder.id}-${index}`
                                          }
                                          className="flex flex-col gap-4 rounded-xl border border-[#EFE5D5] p-3 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                          <div className="flex min-w-0 items-center gap-3">
                                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[#E7D8BC] bg-[#F8F4EC]">
                                              <Image
                                                src={
                                                  item.image ||
                                                  "/images/no-image.png"
                                                }
                                                alt={
                                                  item.product_name ||
                                                  "Product"
                                                }
                                                width={64}
                                                height={64}
                                                className="h-full w-full object-cover"
                                              />
                                            </div>

                                            <div className="min-w-0">
                                              <p className="font-semibold text-[#183153]">
                                                {item.product_name ||
                                                  item.products
                                                    ?.name ||
                                                  "Product"}
                                              </p>

                                              {item.sku && (
                                                <p className="mt-1 text-xs text-gray-500">
                                                  SKU:{" "}
                                                  {item.sku}
                                                </p>
                                              )}

                                              {item.size && (
                                                <p className="mt-1 text-xs text-gray-500">
                                                  Size:{" "}
                                                  {item.size}
                                                </p>
                                              )}
                                            </div>
                                          </div>

                                          <div className="flex items-center justify-between gap-6 text-sm sm:justify-end">
                                            <div>
                                              <p className="text-gray-500">
                                                Qty
                                              </p>

                                              <p className="font-semibold text-[#183153]">
                                                {
                                                  item.quantity
                                                }
                                              </p>
                                            </div>

                                            <div>
                                              <p className="text-gray-500">
                                                Price
                                              </p>

                                              <p
                                                className="font-semibold"
                                                style={{
                                                  color:
                                                    themeColor,
                                                }}
                                              >
                                                ৳
                                                {Number(
                                                  item.price ||
                                                    0
                                                ).toLocaleString(
                                                  "en-BD"
                                                )}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>

                                {/* TOTAL */}
                                <div className="rounded-xl border border-[#E7D8BC] bg-white p-5">
                                  <div className="ml-auto max-w-md space-y-2 text-sm">

                                    <div className="flex justify-between">
                                      <span className="text-gray-500">
                                        Subtotal
                                      </span>

                                      <span className="font-medium">
                                        ৳
                                        {Number(
                                          selectedOrder.subtotal ||
                                            0
                                        ).toLocaleString(
                                          "en-BD"
                                        )}
                                      </span>
                                    </div>

                                    <div className="flex justify-between">
                                      <span className="text-gray-500">
                                        Shipping
                                      </span>

                                      <span className="font-medium">
                                        ৳
                                        {Number(
                                          selectedOrder.shipping ||
                                            selectedOrder.shipping_charge ||
                                            0
                                        ).toLocaleString(
                                          "en-BD"
                                        )}
                                      </span>
                                    </div>

                                    {Number(
                                      selectedOrder.discount ||
                                        0
                                    ) > 0 && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">
                                          Discount
                                        </span>

                                        <span className="font-medium text-green-600">
                                          - ৳
                                          {Number(
                                            selectedOrder.discount
                                          ).toLocaleString(
                                            "en-BD"
                                          )}
                                        </span>
                                      </div>
                                    )}

                                    <div className="border-t border-[#E7D8BC] pt-3">
                                      <div className="flex justify-between text-lg font-bold">
                                        <span>
                                          Grand Total
                                        </span>

                                        <span
                                          style={{
                                            color:
                                              themeColor,
                                          }}
                                        >
                                          ৳
                                          {Number(
                                            selectedOrder.total ||
                                              0
                                          ).toLocaleString(
                                            "en-BD"
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* STATUS HISTORY */}
                                {selectedOrder.statusHistory
                                  ?.length > 0 && (
                                  <div className="rounded-xl border border-[#E7D8BC] bg-white p-5">
                                    <h4
                                      className="font-bold"
                                      style={{
                                        color:
                                          themeColor,
                                      }}
                                    >
                                      Order Status History
                                    </h4>

                                    <div className="mt-4 space-y-3">
                                      {selectedOrder.statusHistory.map(
                                        (
                                          history: any,
                                          index: number
                                        ) => (
                                          <div
                                            key={
                                              history.id ||
                                              index
                                            }
                                            className="flex items-center justify-between rounded-lg bg-[#F8F4EC] px-4 py-3"
                                          >
                                            <span className="font-semibold text-[#183153]">
                                              {
                                                history.status
                                              }
                                            </span>

                                            <span className="text-xs text-gray-500">
                                              {history.created_at
                                                ? formatDate(
                                                    history.created_at
                                                  )
                                                : ""}
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}

                              </div>
                            ) : null}
                          </td>
                        </tr>
                      )}
                        </React.Fragment>
  );
})}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function WishlistView({ themeColor }: { themeColor: string }) {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await getWishlist();
        if (active) setWishlist(data || []);
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  async function handleRemove(id: string) {
    try {
      await removeFromWishlist(id);
      setWishlist((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to remove wishlist item:", error);
    }
  }

  return (
    <div>
      <div className="mb-5">
        <h3 className="text-2xl font-bold text-[#183153]">Wishlist</h3>
        <p className="mt-1 text-sm text-gray-500">
          Products you have saved for later.
        </p>
      </div>

      {loading ? (
        <PanelMessage text="Loading wishlist..." />
      ) : wishlist.length === 0 ? (
        <PanelMessage
          title="Your Wishlist is Empty"
          text="Browse products and add your favorite items."
          action="Browse Products"
          href="/products"
        />
      ) : (
        <div className="space-y-3">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border border-[#E7D8BC] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-[#183153]">
                  {item.product_name || item.name || "Product"}
                </p>
                {item.price != null && (
                  <p className="mt-1 text-sm" style={{ color: themeColor }}>
                    ৳{Number(item.price).toLocaleString("en-BD")}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddressesView({
  profile,
  themeColor,
  onEdit,
}: {
  profile: any;
  themeColor: string;
  onEdit: () => void;
}) {
  const hasAddress = Boolean(profile?.address?.trim());

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-2xl font-bold text-[#183153]">My Addresses</h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage your saved delivery address.
          </p>
        </div>
        {hasAddress && (
          <button
            type="button"
            onClick={onEdit}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: themeColor }}
          >
            Edit Address
          </button>
        )}
      </div>

      {!hasAddress ? (
        <PanelMessage
          title="No Address Saved"
          text="Add your delivery address from Edit Profile."
          action="Edit Profile"
          onAction={onEdit}
        />
      ) : (
        <div className="rounded-2xl border border-[#E7CFA3] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <h4 className="text-xl font-semibold text-[#183153]">
              {profile.full_name || "Customer"}
            </h4>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Default
            </span>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Info label="Phone" value={profile.phone} />
            <Info label="Postal Code" value={profile.postal_code} />
            <Info label="Division" value={profile.division} />
            <Info label="District" value={profile.district} />
            <Info label="Upazila / Thana" value={profile.upazila} />
          </div>

          <div className="mt-5">
            <p className="text-sm text-gray-500">Full Address</p>
            <p className="mt-1 leading-7 text-[#183153]">{profile.address}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileView({
  profile: initialProfile,
  themeColor,
  onSaved,
}: {
  profile: any;
  themeColor: string;
  onSaved: () => Promise<void>;
}) {
  const [profile, setProfile] = useState<any>(initialProfile);
  const [division, setDivision] = useState(initialProfile?.division || "");
  const [district, setDistrict] = useState(initialProfile?.district || "");
  const [upazila, setUpazila] = useState(initialProfile?.upazila || "");
  const [address, setAddress] = useState(initialProfile?.address || "");
  const [postalCode, setPostalCode] = useState(initialProfile?.postal_code || "");
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCurrentProfile();
        if (!data) return;
        setProfile(data);
        setDivision(data.division || "");
        setDistrict(data.district || "");
        setUpazila(data.upazila || "");
        setAddress(data.address || "");
        setPostalCode(data.postal_code || "");
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    }
    load();
  }, []);

  async function handlePhotoChange(file: File | null) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Photo size must be 5 MB or less.");
      return;
    }

    try {
      setUploadingPhoto(true);

      const avatarUrl = await uploadAvatar(file);

      setProfile((prev: any) => ({
        ...prev,
        avatar: avatarUrl,
      }));

      await onSaved();
      alert("Profile photo updated.");
    } catch (error: any) {
      console.error("Profile photo upload failed:", error);
      alert(error?.message || "Profile photo update failed.");
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) {
        photoInputRef.current.value = "";
      }
    }
  }

  async function handleSave() {
    if (!division) return alert("Please select Division.");
    if (!district) return alert("Please select District.");
    if (!upazila) return alert("Please select Upazila / Thana.");
    if (!address.trim()) return alert("Please enter Full Address.");

    try {
      setSaving(true);
      await updateCurrentProfile({
        division,
        district,
        upazila,
        address,
        postal_code: postalCode,
      });
      const data = await getCurrentProfile();
      if (data) setProfile(data);
      await onSaved();
      alert("Profile updated successfully");
    } catch (error: any) {
      alert(error?.message || "Profile update failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-5">
        <h3 className="text-2xl font-bold text-[#183153]">My Profile</h3>
        <p className="mt-1 text-sm text-gray-500">
          Update your customer profile and delivery details.
        </p>
      </div>

      <div className="rounded-2xl border border-[#E7D8BC] bg-white p-5 shadow-sm sm:p-7">
        <div className="flex items-center gap-5">
          {profile?.avatar ? (
            <Image
              src={profile.avatar}
              alt="Avatar"
              width={88}
              height={88}
              className="h-[88px] w-[88px] rounded-full border-2 border-[#D8B26A] object-cover"
            />
          ) : (
            <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full border-2 border-[#D8B26A] bg-[#EEF2F7] text-3xl font-bold text-[#183153]">
              {profile?.full_name?.charAt(0) || "C"}
            </div>
          )}
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handlePhotoChange(e.target.files?.[0] || null)}
          />

          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            disabled={uploadingPhoto}
            className="rounded-xl px-5 py-2.5 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: themeColor }}
          >
            {uploadingPhoto ? "Uploading..." : "Change Photo"}
          </button>
        </div>

        <div className="my-7 border-t border-[#E7D8BC]" />

        <div className="grid gap-5 md:grid-cols-2">
          <ReadonlyField label="Full Name" value={profile?.full_name} />
          <ReadonlyField label="Email" value={profile?.email} />
          <ReadonlyField label="Phone Number" value={profile?.phone} />

          <div className="md:col-span-2">
            <AddressSelector
              division={division}
              district={district}
              upazila={upazila}
              postalCode={postalCode}
              onDivisionChange={setDivision}
              onDistrictChange={setDistrict}
              onUpazilaChange={setUpazila}
              onPostalCodeChange={setPostalCode}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-[#183153]">
              Full Address <span className="text-red-600">*</span>
            </label>
            <textarea
              rows={4}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House / Road / Village / Landmark"
              className="w-full resize-none rounded-xl border border-[#DCCEB6] bg-white px-4 py-3 text-[#183153] outline-none focus:border-[#A8741A] focus:ring-4 focus:ring-[#A8741A]/20"
            />
          </div>
        </div>

        <div className="mt-7 flex justify-end border-t border-[#E7D8BC] pt-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl px-7 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: themeColor }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PasswordView({
  themeColor,
  onSuccess,
}: {
  themeColor: string;
  onSuccess: () => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword) return setError("Please enter your current password.");
    if (newPassword.length < 6) {
      return setError("New password must be at least 6 characters.");
    }
    if (newPassword !== confirmPassword) {
      return setError("New passwords do not match.");
    }
    if (currentPassword === newPassword) {
      return setError("New password must be different from your current password.");
    }

    try {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user?.email) {
        throw new Error("Customer account email could not be found.");
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) throw new Error("Current password is incorrect.");

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Password changed successfully.");

      setTimeout(onSuccess, 1000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Password change failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-5">
        <h3 className="text-2xl font-bold text-[#183153]">Change Password</h3>
        <p className="mt-1 text-sm text-gray-500">
          Update your customer account password securely.
        </p>
      </div>

      <div className="rounded-2xl border border-[#E7D8BC] bg-white p-5 shadow-sm sm:p-7">
        <form onSubmit={handleSubmit} className="space-y-5">
          <PasswordField
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
            placeholder="Enter current password"
            autoComplete="current-password"
          />
          <PasswordField
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="Minimum 6 characters"
            autoComplete="new-password"
          />
          <PasswordField
            label="Confirm New Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Re-enter new password"
            autoComplete="new-password"
          />

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {success}
            </div>
          )}

          <div className="flex justify-end border-t border-[#E7D8BC] pt-5">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl px-7 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: themeColor }}
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#183153]">
        {label}
      </span>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#D9CDB8] bg-white px-4 py-3 text-[#183153] outline-none transition focus:border-[#A8741A] focus:ring-2 focus:ring-[#A8741A]/20"
      />
    </label>
  );
}

function PanelMessage({
  title,
  text,
  action,
  href,
  onAction,
}: {
  title?: string;
  text: string;
  action?: string;
  href?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[#E7D8BC] bg-white px-5 py-14 text-center shadow-sm">
      <div className="text-5xl">{title?.includes("Order") ? "📦" : "♡"}</div>
      {title && <h4 className="mt-4 text-2xl font-bold text-[#183153]">{title}</h4>}
      <p className="mt-2 text-sm text-gray-500">{text}</p>
      {action && href && (
        <a
          href={href}
          className="mt-6 inline-block rounded-xl bg-[#A8741A] px-6 py-3 font-semibold text-white hover:opacity-90"
        >
          {action}
        </a>
      )}
      {action && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-xl bg-[#A8741A] px-6 py-3 font-semibold text-white hover:opacity-90"
        >
          {action}
        </button>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 break-words font-medium text-[#183153]">
        {value || "-"}
      </p>
    </div>
  );
}

function ReadonlyField({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#183153]">
        {label}
      </label>
      <input
        value={value || ""}
        disabled
        className="w-full cursor-not-allowed rounded-xl border border-[#DCCEB6] bg-[#F3F4F6] px-4 py-3 text-[#6B7280]"
      />
    </div>
  );
}

function formatDate(date: string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}