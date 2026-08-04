"use client";

import { useEffect, useState } from "react";

import {
  getDivisions,
  getDistricts,
  getUpazilas,
  getPostalCodes,
} from "@/lib/bd-address";

interface Props {
  division: string;
  district: string;
  upazila: string;
  postalCode: string;

  onDivisionChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
  onUpazilaChange: (value: string) => void;
  onPostalCodeChange: (value: string) => void;
}

export default function AddressSelector({
  division,
  district,
  upazila,
  postalCode,

  onDivisionChange,
  onDistrictChange,
  onUpazilaChange,
  onPostalCodeChange,
}: Props) {

  const [districts, setDistricts] = useState<any[]>([]);
  const [upazilas, setUpazilas] = useState<any[]>([]);
  const [postalCodes, setPostalCodes] = useState<string[]>([]);

  useEffect(() => {
    setDistricts(getDistricts(division));
  }, [division]);

  useEffect(() => {
    setUpazilas(
      getUpazilas(
        division,
        district
      )
    );
  }, [division, district]);

  useEffect(() => {
    setPostalCodes(
      getPostalCodes(
        division,
        district,
        upazila
      )
    );
  }, [division, district, upazila]);

  return (
    <div className="grid md:grid-cols-2 gap-6">

        <div>

        <label className="block mb-2 text-sm font-semibold text-[#183153]">
  Division <span className="text-red-600">*</span>
</label>

        <select
          value={division}
          onChange={(e) => {
            onDivisionChange(e.target.value);
            onDistrictChange("");
            onUpazilaChange("");
            onPostalCodeChange("");
          }}
          className="w-full rounded-xl border border-[#DCCEB6] bg-white px-4 py-3 text-[#183153] outline-none focus:border-[#A8741A] focus:ring-4 focus:ring-[#A8741A]/20"
        >
          <option value="">Select Division</option>

          {getDivisions().map((item) => (
            <option
              key={item.name}
              value={item.name}
            >
              {item.name}
            </option>
          ))}

        </select>

      </div>

      <div>

        <label className="block mb-2 text-sm font-semibold text-[#183153]">
  District <span className="text-red-600">*</span>
</label>

        <select
          value={district}
          onChange={(e) => {
            onDistrictChange(e.target.value);
            onUpazilaChange("");
            onPostalCodeChange("");
          }}
          className="w-full rounded-xl border border-[#DCCEB6] bg-white px-4 py-3 text-[#183153] outline-none focus:border-[#A8741A] focus:ring-4 focus:ring-[#A8741A]/20"
        >
          <option value="">Select District</option>

          {districts.map((item) => (
            <option
              key={item.name}
              value={item.name}
            >
              {item.name}
            </option>
          ))}

        </select>

      </div>

      <div>

        <label className="block mb-2 text-sm font-semibold text-[#183153]">
  Upazila / Thana <span className="text-red-600">*</span>
</label>

        <select
          value={upazila}
          onChange={(e) => {
            onUpazilaChange(e.target.value);
            onPostalCodeChange("");
          }}
          className="w-full rounded-xl border border-[#DCCEB6] bg-white px-4 py-3 text-[#183153] outline-none focus:border-[#A8741A] focus:ring-4 focus:ring-[#A8741A]/20"
        >
          <option value="">Select Upazila</option>

          {upazilas.map((item) => (
            <option
              key={item.name}
              value={item.name}
            >
              {item.name}
            </option>
          ))}

        </select>

      </div>

            <div>

        <label className="block mb-2 text-sm font-semibold text-[#183153]">
          Postal Code
        </label>

        <select
          value={postalCode}
          onChange={(e) => onPostalCodeChange(e.target.value)}
          className="w-full rounded-xl border border-[#DCCEB6] bg-white px-4 py-3 text-[#183153] outline-none focus:border-[#A8741A] focus:ring-4 focus:ring-[#A8741A]/20"
        >
          <option value="">Select Postal Code</option>

          {postalCodes.map((code) => (
            <option
              key={code}
              value={code}
            >
              {code}
            </option>
          ))}

        </select>

      </div>

    </div>
  );
}