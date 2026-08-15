"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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

type Props = {
  profile: any;
  onLogout: () => void;
};

export default function UserMenu({ profile, onLogout }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function handleLogout() {
    setOpen(false);
    onLogout();
  }

  return (
    <>
      {/* Header account button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open account menu"
        className="flex items-center gap-3 rounded-xl border border-[#DCCEB6] bg-white px-3 py-2 hover:shadow-md transition"
      >
        {profile?.avatar ? (
          <Image
            src={profile.avatar}
            alt={profile?.full_name || "Avatar"}
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover border border-[#DCCEB6]"
          />
        ) : (
          <div className="h-11 w-11 rounded-full bg-[#EEF2F7] flex items-center justify-center text-[#183153] font-bold text-lg border border-[#DCCEB6]">
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

      {open && (
        <>
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close account menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[90] bg-black/30 cursor-default"
          />

          {/* Drawer */}
          <aside
            className="fixed right-0 top-0 z-[100] h-screen w-full max-w-[390px] bg-white shadow-2xl flex flex-col"
            aria-label="Account drawer"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-[#E7D8BC] px-6 py-5">
              <div className="flex items-center gap-3 min-w-0">
                {profile?.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={profile?.full_name || "Avatar"}
                    width={52}
                    height={52}
                    className="h-13 w-13 rounded-full object-cover border border-[#DCCEB6]"
                  />
                ) : (
                  <div className="h-[52px] w-[52px] shrink-0 rounded-full bg-[#EEF2F7] flex items-center justify-center text-[#183153] font-bold text-xl border border-[#DCCEB6]">
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
                className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#DCCEB6] text-[#183153] hover:bg-[#F8F4EC] transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Account info */}
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

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-4">
              <DrawerLink
                href="/account"
                icon={<UserRound size={19} />}
                label="My Account"
                onClick={() => setOpen(false)}
              />
              <DrawerLink
                href="/account/orders"
                icon={<Package size={19} />}
                label="My Orders"
                onClick={() => setOpen(false)}
              />
              <DrawerLink
                href="/account/wishlist"
                icon={<Heart size={19} />}
                label="Wishlist"
                onClick={() => setOpen(false)}
              />
              <DrawerLink
                href="/account/addresses"
                icon={<MapPin size={19} />}
                label="Addresses"
                onClick={() => setOpen(false)}
              />
              <DrawerLink
                href="/account/profile"
                icon={<UserRound size={19} />}
                label="Edit Profile"
                onClick={() => setOpen(false)}
              />
              <DrawerLink
                href="/account/change-password"
                icon={<KeyRound size={19} />}
                label="Change Password"
                onClick={() => setOpen(false)}
              />
            </nav>

            {/* Logout */}
            <div className="border-t border-[#E7D8BC] p-4">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-semibold text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={19} />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

function DrawerLink({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-[#183153] hover:bg-[#F8F4EC] hover:text-[#98691D] transition-colors"
    >
      <span className="shrink-0">{icon}</span>
      <span className="flex-1 font-medium">{label}</span>
      <ChevronRight size={17} className="text-gray-400" />
    </Link>
  );
}