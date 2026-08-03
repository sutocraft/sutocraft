"use client";

import { loginAdmin } from "@/lib/auth";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Enter your admin email.");
      return;
    }

    if (!password.trim()) {
      setError("Enter your password.");
      return;
    }

    try {
  console.log("STEP 1");

  setLoading(true);

  console.log("STEP 2", {
    email,
    passwordLength: password.length,
  });

  await loginAdmin(email, password);

  console.log("STEP 3 Login Success");

  router.replace("/admin");

  console.log("STEP 4 Router Replace Called");
} catch (err) {
  console.error("ADMIN LOGIN ERROR:", err);

  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Login failed.");
  }
} finally {
  console.log("STEP 5 Finally");

  setLoading(false);
}
  }

  return (
    <main className="min-h-screen bg-[#F8F4EC] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md rounded-2xl border border-[#E5D6BC] bg-white p-8 shadow-xl text-[#1F2937]">

        <div className="mb-8 text-center">

          <p className="text-xs font-semibold uppercase tracking-[4px] text-[#A8741A]">
            Admin Panel
          </p>

          <h1 className="mt-3 text-4xl font-bold text-[#1F2937]">
            Admin Login
          </h1>

          <p className="mt-3 text-gray-500">
            Login to manage the SutoCraft administration panel.
          </p>

        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>

            <label className="mb-2 block text-sm font-medium text-[#1F2937]">
              Admin Email
            </label>

            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              className="h-14 w-full rounded-xl border border-[#E5D6BC] bg-white px-4 text-[#1F2937] placeholder:text-gray-400 outline-none transition focus:border-[#A8741A] focus:ring-2 focus:ring-[#A8741A]/20"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium text-[#1F2937]">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="h-14 w-full rounded-xl border border-[#E5D6BC] bg-white px-4 pr-12 text-[#1F2937] placeholder:text-gray-400 outline-none transition focus:border-[#A8741A] focus:ring-2 focus:ring-[#A8741A]/20"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

          </div>

          <div className="flex items-center justify-between">

            <label className="flex items-center gap-2 text-sm text-gray-700">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 accent-[#A8741A]"
              />

              Remember Me

            </label>

            <Link
              href="/admin/forgot-password"
              className="text-sm font-medium text-[#A8741A] hover:underline"
            >
              Forgot Password?
            </Link>

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
                ? "cursor-not-allowed bg-gray-400"
                : "bg-[#A8741A] hover:bg-[#8C6416]"
            }`}
          >
            {loading ? "Signing In..." : "Admin Login"}
          </button>

        </form>

        <div className="mt-8 border-t border-[#E5D6BC] pt-6 text-center">

          <Link
            href="/"
            className="font-medium text-[#A8741A] hover:underline"
          >
            ← Back to Website
          </Link>

        </div>

      </div>
    </main>
  );
}