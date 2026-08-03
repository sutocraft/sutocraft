"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#F8F4EC] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5D6BC] shadow-lg p-8">

        <div className="text-center mb-8">
          <p className="text-[#A8741A] uppercase tracking-[4px] text-xs font-semibold">
            Welcome Back
          </p>

          <h1 className="mt-3 text-4xl font-bold text-[#1F2937]">
            Customer Login
          </h1>

          <p className="mt-3 text-gray-500">
            Login to access your orders, wishlist and account.
          </p>
        </div>

        <form className="space-y-5">

          <div>
            <label className="block mb-2 text-sm font-medium text-[#1F2937]">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-xl border border-[#E5D6BC] px-4 py-3 outline-none focus:border-[#A8741A]"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-[#1F2937]">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-xl border border-[#E5D6BC] px-4 py-3 outline-none focus:border-[#A8741A]"
            />
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-[#A8741A] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#A8741A] py-3 font-semibold text-white transition hover:bg-[#8C6416]"
          >
            Login
          </button>
        </form>

        <div className="mt-8 border-t border-[#E5D6BC] pt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?
          </p>

          <Link
            href="/register"
            className="mt-3 inline-block font-semibold text-[#A8741A] hover:underline"
          >
            Create New Account
          </Link>
        </div>

      </div>
    </main>
  );
}