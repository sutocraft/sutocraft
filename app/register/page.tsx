"use client";

import { registerCustomer } from "@/lib/auth";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (!fullName.trim()) {
      alert("Enter your full name");
      return;
    }

    if (!phone.trim()) {
      alert("Enter your phone number");
      return;
    }

    if (!email.trim()) {
      alert("Enter your email");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await registerCustomer({
  fullName,
  phone,
  email,
  password,
});

alert("Account created successfully.");

router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F3EA] flex items-center justify-center px-4">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        <p className="text-center uppercase tracking-[5px] text-[#B8861B] text-xs font-semibold">
          Welcome
        </p>

        <h1 className="text-4xl font-bold text-center text-[#1F2A44] mt-3">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mt-3 mb-8">
          Create your SutoCraft customer account.
        </p>

        <form onSubmit={handleRegister} className="space-y-5">

          <div>
            <label className="block mb-2 text-sm font-semibold text-[#1F2937]">
              Full Name
            </label>

            <input
  value={fullName}
  onChange={(e) => setFullName(e.target.value)}
  placeholder="Enter your full name"
  className="w-full mt-2 h-14 rounded-xl border border-[#D8C3A5] bg-white px-4 text-[#1F2937] placeholder:text-gray-400 outline-none transition focus:border-[#B8861B] focus:ring-2 focus:ring-[#B8861B]/20"
/>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-[#1F2937]">
              Phone Number
            </label>

            <input
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  placeholder="01XXXXXXXXX"
  className="w-full mt-2 h-14 rounded-xl border border-[#D8C3A5] bg-white px-4 text-[#1F2937] placeholder:text-gray-400 outline-none transition focus:border-[#B8861B] focus:ring-2 focus:ring-[#B8861B]/20"
/>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-[#1F2937]">
              Email Address
            </label>

            <input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Enter your email"
  className="w-full mt-2 h-14 rounded-xl border border-[#D8C3A5] bg-white px-4 text-[#1F2937] placeholder:text-gray-400 outline-none transition focus:border-[#B8861B] focus:ring-2 focus:ring-[#B8861B]/20"
/>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-[#1F2937]">
              Password
            </label>

            <input
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Enter your password"
  className="w-full mt-2 h-14 rounded-xl border border-[#D8C3A5] bg-white px-4 text-[#1F2937] placeholder:text-gray-400 outline-none transition focus:border-[#B8861B] focus:ring-2 focus:ring-[#B8861B]/20"
/>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-[#1F2937]">
              Confirm Password
            </label>

            <input
  type="password"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
  placeholder="Confirm your password"
  className="w-full mt-2 h-14 rounded-xl border border-[#D8C3A5] bg-white px-4 text-[#1F2937] placeholder:text-gray-400 outline-none transition focus:border-[#B8861B] focus:ring-2 focus:ring-[#B8861B]/20"
/>
          </div>

          {error && (
  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
    {error}
  </div>
)}

<button
  type="submit"
  disabled={loading}
  className={`w-full rounded-xl py-3 font-semibold text-white transition ${
    loading
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-[#B8861B] hover:bg-[#9C6F13]"
  }`}
>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <div className="border-t mt-8 pt-6 text-center">

          <p className="text-gray-600">
            Already have an account?
          </p>

          <Link
            href="/login"
            className="text-[#B8861B] font-semibold hover:underline"
          >
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}