"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  profile: any;
  onLogout: () => void;
};

export default function UserMenu({
  profile,
  onLogout,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-xl border border-[#DCCEB6] bg-white px-3 py-2 hover:shadow-md transition"
      >

        {profile?.avatar ? (

          <Image
            src={profile.avatar}
            alt="Avatar"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover border border-[#DCCEB6]"
          />

        ) : (

          <div className="h-11 w-11 rounded-full bg-[#EEF2F7] flex items-center justify-center text-[#183153] font-bold text-lg border border-[#DCCEB6]">
            {profile?.full_name?.charAt(0)}
          </div>

        )}

        <div className="text-left">

          <p className="font-semibold text-[#183153]">
            {profile?.full_name}
          </p>

          <p className="text-xs text-gray-500">
            My Account
          </p>

        </div>

      </button>

      {open && (

        <div className="absolute right-0 mt-3 w-64 rounded-xl border border-[#E7D8BC] bg-white shadow-xl overflow-hidden z-50">

          <Link
            href="/account"
            className="block px-5 py-3 hover:bg-[#F8F4EC]"
          >
            My Account
          </Link>

          <Link
            href="/account/orders"
            className="block px-5 py-3 hover:bg-[#F8F4EC]"
          >
            My Orders
          </Link>

          <Link
            href="/account/wishlist"
            className="block px-5 py-3 hover:bg-[#F8F4EC]"
          >
            Wishlist
          </Link>

          <Link
            href="/account/addresses"
            className="block px-5 py-3 hover:bg-[#F8F4EC]"
          >
            Addresses
          </Link>

          <Link
            href="/change-password"
            className="block px-5 py-3 hover:bg-[#F8F4EC]"
          >
            Change Password
          </Link>

          <hr />

          <button
            onClick={onLogout}
            className="block w-full text-left px-5 py-3 text-red-600 hover:bg-red-50"
          >
            Logout
          </button>

        </div>

      )}

    </div>
  );
}