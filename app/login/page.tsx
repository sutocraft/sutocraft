"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { loginCustomer } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRegistered(new URLSearchParams(window.location.search).get("registered") === "1");
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!identifier.trim()) return setError("Enter your email or phone number.");
    if (!password) return setError("Enter your password.");

    try {
      setLoading(true);
      await loginCustomer(identifier, password);

      const redirect = localStorage.getItem("login-redirect");
      localStorage.removeItem("login-redirect");

      if (redirect === "cart") {
        localStorage.setItem("open-cart-after-login", "true");
        router.replace("/");
        return;
      }
      if (redirect === "checkout") {
        router.replace("/checkout");
        return;
      }
      if (redirect === "wishlist") {
        router.replace("/wishlist");
        return;
      }

      // Normal customer login: return to home and open the updated
      // customer account popup instead of navigating to /account.
      localStorage.setItem("open-account-after-login", "true");
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--theme-background)] px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-md rounded-3xl border border-[var(--theme-primary-border)] bg-white p-6 shadow-xl sm:p-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--theme-primary)]">Welcome Back</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Customer Login</h1>
          <p className="mt-3 text-sm text-slate-500">Use your email or phone number with your password.</p>
        </div>

        {registered && (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Account created successfully. You can login now.
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800">Email / Phone *</span>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              placeholder="Email or 01XXXXXXXXX"
              className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[var(--theme-primary)] focus:ring-4 focus:ring-[var(--theme-primary-ring)]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800">Password *</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="h-12 w-full rounded-xl border border-slate-200 px-4 pr-12 text-sm outline-none focus:border-[var(--theme-primary)] focus:ring-4 focus:ring-[var(--theme-primary-ring)]"
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </label>

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm font-semibold text-[var(--theme-primary)] hover:underline">
              Forgot Password?
            </Link>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-[var(--theme-primary)] text-sm font-bold text-white shadow-[0_8px_24px_var(--theme-primary-shadow)] transition hover:bg-[var(--theme-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-[var(--theme-primary)] hover:underline">
            Create Customer Account
          </Link>
        </div>
      </div>
    </main>
  );
}