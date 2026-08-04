"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentProfile,
  logoutCustomer,
} from "@/lib/auth";

export default function AccountPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data = await getCurrentProfile();

      if (!data) {
        router.replace("/login");
        return;
      }

      setProfile(data);
    } catch {
      router.replace("/login");
    }
  }

  async function handleLogout() {
    await logoutCustomer();
    router.replace("/login");
    router.refresh();
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F4EC] text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F4EC] py-10 px-4">

      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="flex items-center justify-between mb-10">

          <div>

            <h1 className="text-4xl font-bold text-[#183153]">
              Welcome,
            </h1>

            <p className="mt-2 text-2xl text-gray-700">
              {profile.full_name}
            </p>

          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Logout
          </button>

        </div>

        {/* Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <Link
            href="/account/orders"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
          >
            <h3 className="text-xl font-bold text-[#183153]">
              My Orders
            </h3>

            <p className="text-5xl font-bold text-[#A8741A] mt-6">
              0
            </p>
          </Link>

          <Link
            href="/account/wishlist"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
          >
            <h3 className="text-xl font-bold text-[#183153]">
              Wishlist
            </h3>

            <p className="text-5xl font-bold text-[#A8741A] mt-6">
              0
            </p>
          </Link>

          <Link
            href="/account/addresses"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
          >
            <h3 className="text-xl font-bold text-[#183153]">
              Addresses
            </h3>

            <p className="mt-6 text-gray-600">
              Manage Address
            </p>
          </Link>

          <Link
            href="/account/profile"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
          >
            <h3 className="text-xl font-bold text-[#183153]">
              Profile
            </h3>

            <p className="mt-6 text-gray-600">
              Edit Profile
            </p>
          </Link>

        </div>

        {/* Account Information */}

        <div className="bg-white rounded-xl shadow-md mt-10 p-8">

          <h2 className="text-3xl font-bold text-[#183153] mb-8">
            Account Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p className="text-sm text-gray-500">
                Full Name
              </p>

              <p className="text-lg font-semibold text-[#183153]">
                {profile.full_name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="text-lg font-semibold text-[#183153]">
                {profile.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Phone
              </p>

              <p className="text-lg font-semibold text-[#183153]">
                {profile.phone}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Role
              </p>

              <p className="text-lg font-semibold text-[#183153] capitalize">
                {profile.role}
              </p>
            </div>

          </div>

        </div>

      </div>

    </main>
  );
}