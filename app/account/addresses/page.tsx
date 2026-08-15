"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentProfile } from "@/lib/auth";

type Address = {
  id: string;
  name: string;
  phone: string;
  address: string;
  division: string;
  district: string;
  upazila: string;
  postalCode: string;
  isDefault: boolean;
};

export default function AddressesPage() {
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAddress() {
      try {
        const profile = await getCurrentProfile();

        if (!profile) {
          window.location.href = "/login";
          return;
        }

        if (profile.address?.trim()) {
          setAddress({
            id: profile.id,
            name: profile.full_name || "Customer",
            phone: profile.phone || "",
            address: profile.address,
            division: profile.division || "",
            district: profile.district || "",
            upazila: profile.upazila || "",
            postalCode: profile.postal_code || "",
            isDefault: true,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadAddress();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F4EC] py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#163A70]">
              My Addresses
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your saved delivery address.
            </p>
          </div>

          <Link
            href="/account"
            className="px-5 py-3 rounded-xl border border-[#E7CFA3] bg-white text-[#163A70] hover:bg-[#B67A18] hover:text-white transition"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
            Loading address...
          </div>
        ) : address ? (
          <div className="bg-white rounded-2xl border border-[#E7CFA3] shadow-lg shadow-[#B67A18]/15 p-6">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-2xl font-semibold text-[#163A70]">
                {address.name}
              </h2>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                Default
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <Info label="Phone" value={address.phone} />
              <Info label="Postal Code" value={address.postalCode} />
              <Info label="Division" value={address.division} />
              <Info label="District" value={address.district} />
              <Info label="Upazila / Thana" value={address.upazila} />
            </div>

            <div className="mt-5">
              <p className="text-sm text-gray-500 mb-1">Full Address</p>
              <p className="text-[#163A70] leading-7">{address.address}</p>
            </div>

            <div className="mt-6">
              <Link
                href="/account/profile"
                className="inline-block rounded-xl bg-[#B67A18] px-5 py-3 font-semibold text-white hover:bg-[#9B6612] transition"
              >
                Edit Address
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E7CFA3] shadow-lg py-20 text-center">
            <div className="text-6xl mb-5">📍</div>
            <h2 className="text-3xl font-bold text-[#163A70]">
              No Address Found
            </h2>
            <p className="mt-3 text-gray-600">
              Please add your delivery address from your profile.
            </p>
            <Link
              href="/account/profile"
              className="inline-block mt-8 rounded-xl bg-[#B67A18] px-8 py-3 font-semibold text-white hover:bg-[#9B6612] transition"
            >
              Add Address
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-[#163A70]">{value || "-"}</p>
    </div>
  );
}