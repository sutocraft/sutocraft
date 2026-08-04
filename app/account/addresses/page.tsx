"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Address = {
  id: number;
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
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    setAddresses([
      {
        id: 1,
        name: "Md. Mostafa",
        phone: "01406503242",
        address: "KSRM, Royel Gate, Bara Kumira-4314",
        division: "Chattogram",
        district: "Chattogram",
        upazila: "Sitakunda",
        postalCode: "4310",
        isDefault: true,
      },
      {
        id: 2,
        name: "Office",
        phone: "01406503242",
        address: "Shafa Abid Automation BD",
        division: "Chattogram",
        district: "Chattogram",
        upazila: "Sitakunda",
        postalCode: "4310",
        isDefault: false,
      },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F4EC] py-10">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-5xl font-bold text-[#163A70]">
              My Addresses
            </h1>

            <p className="text-gray-600 mt-2">
              Manage your saved delivery addresses.
            </p>
          </div>

          <div className="flex gap-3">

            <Link
              href="/account"
              className="px-6 py-3 rounded-xl border border-[#E7CFA3] bg-white text-[#163A70] hover:bg-[#B67A18] hover:text-white transition"
            >
              ← Back to Dashboard
            </Link>

            <Link
              href="/account/addresses/new"
              className="px-6 py-3 rounded-xl bg-[#B67A18] text-white hover:bg-[#9B6612] transition"
            >
              + Add Address
            </Link>

          </div>

        </div>
                <div className="grid gap-6">

          {addresses.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E7CFA3] shadow-lg shadow-[#B67A18]/15 p-6"
            >

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                <div className="flex-1">

                  <div className="flex items-center gap-3 mb-4">

                    <h2 className="text-2xl font-semibold text-[#163A70]">
                      {item.name}
                    </h2>

                    {item.isDefault && (
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                        Default
                      </span>
                    )}

                  </div>

                  <div className="grid md:grid-cols-2 gap-5">

                    <div>
                      <p className="text-sm text-gray-500">
                        Phone
                      </p>

                      <p className="font-medium text-[#163A70]">
                        {item.phone}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Postal Code
                      </p>

                      <p className="font-medium text-[#163A70]">
                        {item.postalCode}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Division
                      </p>

                      <p className="font-medium text-[#163A70]">
                        {item.division}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        District
                      </p>

                      <p className="font-medium text-[#163A70]">
                        {item.district}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Upazila / Thana
                      </p>

                      <p className="font-medium text-[#163A70]">
                        {item.upazila}
                      </p>
                    </div>

                  </div>

                  <div className="mt-5">

                    <p className="text-sm text-gray-500 mb-1">
                      Full Address
                    </p>

                    <p className="text-[#163A70] leading-7">
                      {item.address}
                    </p>

                  </div>

                </div>

                                <div className="flex flex-col gap-3 min-w-[180px]">

                  {!item.isDefault && (
                    <button
                      className="w-full rounded-xl border border-[#E7CFA3] bg-white px-5 py-3 font-semibold text-[#163A70] hover:bg-[#F8F4EC] transition"
                    >
                      Set Default
                    </button>
                  )}

                  <Link
                    href={`/account/addresses/${item.id}`}
                    className="w-full rounded-xl bg-[#B67A18] px-5 py-3 text-center font-semibold text-white hover:bg-[#9B6612] transition"
                  >
                    Edit Address
                  </Link>

                  <button
                    className="w-full rounded-xl border border-red-300 bg-white px-5 py-3 font-semibold text-red-600 hover:bg-red-50 transition"
                  >
                    Delete Address
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

               {addresses.length === 0 && (

          <div className="bg-white rounded-2xl border border-[#E7CFA3] shadow-lg shadow-[#B67A18]/15 py-20 text-center">

            <div className="text-7xl mb-6">
              📍
            </div>

            <h2 className="text-3xl font-bold text-[#163A70]">
              No Address Found
            </h2>

            <p className="mt-3 text-gray-600">
              You haven't added any delivery address yet.
            </p>

            <Link
              href="/account/addresses/new"
              className="inline-block mt-8 rounded-xl bg-[#B67A18] px-8 py-3 font-semibold text-white hover:bg-[#9B6612] transition"
            >
              + Add Your First Address
            </Link>

          </div>

        )}

      </div>

    </div>
  );
}