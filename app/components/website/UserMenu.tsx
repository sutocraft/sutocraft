"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  X,
  UserRound,
  Package,
  Heart,
  MapPin,
  KeyRound,
  LogOut,
  ChevronRight,
} from "lucide-react";
import CustomerAccountModal from "./CustomerAccountModal";

type Props = {
  profile: any;
  onLogout: () => void;
};

type AccountView =
  | "dashboard"
  | "orders"
  | "wishlist"
  | "addresses"
  | "profile"
  | "password";

export default function UserMenu({ profile, onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const [accountView, setAccountView] = useState<AccountView | null>(null);

  useEffect(() => {
    const locked = open || Boolean(accountView);
    const previousOverflow = document.body.style.overflow;

    if (locked) document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (accountView) {
        setAccountView(null);
      } else {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, accountView]);

  function openAccount(view: AccountView) {
    setOpen(false);
    setAccountView(view);
  }

  function handleLogout() {
    setOpen(false);
    setAccountView(null);
    onLogout();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open account menu"
        className="flex items-center gap-3 rounded-xl border border-[#DCCEB6] bg-white px-3 py-2 transition hover:shadow-md"
      >
        {profile?.avatar ? (
          <Image
            src={profile.avatar}
            alt={profile?.full_name || "Avatar"}
            width={44}
            height={44}
            className="h-11 w-11 rounded-full border border-[#DCCEB6] object-cover"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DCCEB6] bg-[#EEF2F7] text-lg font-bold text-[#183153]">
            {profile?.full_name?.charAt(0) || <UserRound size={20} />}
          </div>
        )}

        <div className="text-left">
          <p className="font-semibold text-[#183153]">
            {profile?.full_name || "My Account"}
          </p>
          <p className="text-xs text-gray-500">My Account</p>
        </div>
      </button>

      {open && typeof document !== "undefined" &&
        createPortal(
          <>
          <button
            type="button"
            aria-label="Close account menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[90] cursor-default bg-black/30"
          />

          <aside
            className="fixed right-0 top-0 z-[100] flex h-screen w-full max-w-[390px] flex-col bg-white shadow-2xl"
            aria-label="Account drawer"
          >
            <div className="flex items-center justify-between border-b border-[#E7D8BC] px-6 py-5">
              <div className="flex min-w-0 items-center gap-3">
                {profile?.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={profile?.full_name || "Avatar"}
                    width={52}
                    height={52}
                    className="h-[52px] w-[52px] shrink-0 rounded-full border border-[#DCCEB6] object-cover"
                  />
                ) : (
                  <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-[#DCCEB6] bg-[#EEF2F7] text-xl font-bold text-[#183153]">
                    {profile?.full_name?.charAt(0) || <UserRound size={22} />}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-lg font-bold text-[#183153]">
                    {profile?.full_name || "My Account"}
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    {profile?.email || ""}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#DCCEB6] text-[#183153] transition hover:bg-[#F8F4EC]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="border-b border-[#E7D8BC] px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Account
              </p>
              {profile?.phone && (
                <p className="mt-2 text-sm font-medium text-[#183153]">
                  {profile.phone}
                </p>
              )}
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-4">
              <DrawerButton
                icon={<UserRound size={19} />}
                label="My Account"
                onClick={() => openAccount("dashboard")}
              />
              <DrawerButton
                icon={<Package size={19} />}
                label="My Orders"
                onClick={() => openAccount("orders")}
              />
              <DrawerButton
                icon={<Heart size={19} />}
                label="Wishlist"
                onClick={() => openAccount("wishlist")}
              />
              <DrawerButton
                icon={<MapPin size={19} />}
                label="Addresses"
                onClick={() => openAccount("addresses")}
              />
              <DrawerButton
                icon={<UserRound size={19} />}
                label="Edit Profile"
                onClick={() => openAccount("profile")}
              />
              <DrawerButton
                icon={<KeyRound size={19} />}
                label="Change Password"
                onClick={() => openAccount("password")}
              />
            </nav>

            <div className="border-t border-[#E7D8BC] p-4">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-semibold text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={19} />
                <span>Logout</span>
              </button>
            </div>
          </aside>
          </>,
          document.body
        )}

      {accountView && (
        <CustomerAccountModal
          profile={profile}
          initialView={accountView}
          onClose={() => setAccountView(null)}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

function DrawerButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-[#183153] transition-colors hover:bg-[#F8F4EC] hover:text-[#98691D]"
    >
      <span className="shrink-0">{icon}</span>
      <span className="flex-1 font-medium">{label}</span>
      <ChevronRight size={17} className="text-gray-400" />
    </button>
  );
}
