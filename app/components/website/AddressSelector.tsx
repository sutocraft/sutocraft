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

const selectClass =
  "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-[var(--theme-primary)] focus:ring-4 focus:ring-[var(--theme-primary-ring)] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

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
    setDistricts(division ? getDistricts(division) : []);
  }, [division]);

  useEffect(() => {
    setUpazilas(division && district ? getUpazilas(division, district) : []);
  }, [division, district]);

  useEffect(() => {
    setPostalCodes(
      division && district && upazila
        ? getPostalCodes(division, district, upazila)
        : []
    );
  }, [division, district, upazila]);

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <label>
        <span className="mb-2 block text-sm font-semibold text-slate-800">Division *</span>
        <select
          value={division}
          onChange={(e) => {
            onDivisionChange(e.target.value);
            onDistrictChange("");
            onUpazilaChange("");
            onPostalCodeChange("");
          }}
          className={selectClass}
          required
        >
          <option value="">Select Division</option>
          {getDivisions().map((item) => (
            <option key={item.name} value={item.name}>{item.name}</option>
          ))}
        </select>
      </label>

      <label>
        <span className="mb-2 block text-sm font-semibold text-slate-800">District *</span>
        <select
          value={district}
          onChange={(e) => {
            onDistrictChange(e.target.value);
            onUpazilaChange("");
            onPostalCodeChange("");
          }}
          className={selectClass}
          disabled={!division}
          required
        >
          <option value="">Select District</option>
          {districts.map((item) => (
            <option key={item.name} value={item.name}>{item.name}</option>
          ))}
        </select>
      </label>

      <label>
        <span className="mb-2 block text-sm font-semibold text-slate-800">Upazila / Thana *</span>
        <select
          value={upazila}
          onChange={(e) => {
            onUpazilaChange(e.target.value);
            onPostalCodeChange("");
          }}
          className={selectClass}
          disabled={!district}
          required
        >
          <option value="">Select Upazila / Thana</option>
          {upazilas.map((item) => (
            <option key={item.name} value={item.name}>{item.name}</option>
          ))}
        </select>
      </label>

      <label>
        <span className="mb-2 block text-sm font-semibold text-slate-800">Postal Code</span>
        <select
          value={postalCode}
          onChange={(e) => onPostalCodeChange(e.target.value)}
          className={selectClass}
          disabled={!upazila}
        >
          <option value="">Select Postal Code</option>
          {postalCodes.map((code) => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>
      </label>
    </div>
  );
}