"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  getCurrentProfile,
  updateCurrentProfile,
  uploadAvatar,
} from "@/lib/auth";

import AvatarUploader from "@/app/components/website/AvatarUploader";

import AddressSelector from "@/app/components/website/AddressSelector";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);

  const [division, setDivision] = useState("");
const [district, setDistrict] = useState("");
const [upazila, setUpazila] = useState("");

const [address, setAddress] = useState("");
const [postalCode, setPostalCode] = useState("");

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data = await getCurrentProfile();

      setProfile(data);

      setDivision(data.division || "");
setDistrict(data.district || "");
setUpazila(data.upazila || "");

setAddress(data.address || "");
setPostalCode(data.postal_code || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {

  if (!division) {
    alert("Please select Division.");
    return;
  }

  if (!district) {
    alert("Please select District.");
    return;
  }

  if (!upazila) {
    alert("Please select Upazila / Thana.");
    return;
  }


  if (!address.trim()) {
    alert("Please enter Full Address.");
    return;
  }
    try {
      setSaving(true);

      await updateCurrentProfile({
  division,
  district,
  upazila,
  address,
  postal_code: postalCode,
});

      alert("Profile updated successfully");

      loadProfile();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F4EC] flex items-center justify-center">
        <div className="text-[#183153] text-xl font-semibold">
          Loading Profile...
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#F8F4EC] flex items-center justify-center">
        <div className="text-red-600 text-xl font-semibold">
          Profile not found.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F4EC] py-14">

      <div className="max-w-5xl mx-auto px-6">

        <h1 className="text-4xl font-bold text-[#183153] mb-8">
          My Profile
        </h1>

        <div className="bg-white border border-[#E7D8BC] rounded-2xl shadow-xl p-8">

          <div className="flex items-center gap-6">

            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt="Avatar"
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover border-2 border-[#D8B26A]"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#EEF2F7] border-2 border-[#D8B26A] flex items-center justify-center text-[#183153] text-4xl font-bold">
                {profile.full_name?.charAt(0)}
              </div>
            )}

            <AvatarUploader
  onSelect={async (file) => {
    try {
      const url = await uploadAvatar(file);

      setProfile({
        ...profile,
        avatar: url,
      });

      alert("Profile photo updated.");
    } catch (err: any) {
      alert(err.message);
    }
  }}
/>

          </div>

          <div className="border-t border-[#E7D8BC] my-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
              <label className="block mb-2 text-sm font-semibold text-[#183153]">
                Full Name
              </label>

              <input
                type="text"
                value={profile.full_name || ""}
                disabled
                className="w-full rounded-xl border border-[#DCCEB6] bg-[#F3F4F6] px-4 py-3 text-[#6B7280] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-[#183153]">
                Email
              </label>

              <input
                type="email"
                value={profile.email || ""}
                disabled
                className="w-full rounded-xl border border-[#DCCEB6] bg-[#F3F4F6] px-4 py-3 text-[#6B7280] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-[#183153]">
                Phone Number
              </label>

              <input
                type="text"
                value={profile.phone || ""}
                disabled
                className="w-full rounded-xl border border-[#DCCEB6] bg-[#F3F4F6] px-4 py-3 text-[#6B7280] cursor-not-allowed"
              />
            </div>

            
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

<div className="md:col-span-2">

  <label className="block mb-2 text-sm font-semibold text-[#183153]">
  Full Address <span className="text-red-600">*</span>
</label>

  <textarea
    rows={4}
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    placeholder="House / Road / Village / Landmark"
    className="w-full rounded-xl border border-[#DCCEB6] bg-white px-4 py-3 text-[#183153] outline-none focus:border-[#A8741A] focus:ring-4 focus:ring-[#A8741A]/20 resize-none"
  />

</div>

          </div>

          <div className="mt-10 flex justify-end">

            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-[#A8741A] hover:bg-[#8F6513] text-white font-semibold px-8 py-3 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}    