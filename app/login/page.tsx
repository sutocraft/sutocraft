"use client";

import { loginCustomer } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {

  const router = useRouter();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: React.FormEvent) {
  e.preventDefault();

  setError("");

  if (!emailOrPhone.trim()) {
    setError("Enter your email or phone number");
    return;
  }

  if (!password.trim()) {
    setError("Enter your password");
    return;
  }

  try {
    setLoading(true);

    await loginCustomer(emailOrPhone, password);

const redirect =
  localStorage.getItem(
    "login-redirect"
  );

localStorage.removeItem(
  "login-redirect"
);

switch (redirect) {

  case "cart":

    localStorage.setItem(
      "open-cart-after-login",
      "true"
    );

    router.push("/");

    break;

  case "checkout":

    router.push("/checkout");

    break;

  case "account":

    router.push("/account");

    break;

  case "wishlist":

    router.push("/account/wishlist");

    break;

  default:

    router.push("/account");

}

  } catch (err) {
    if (err instanceof Error) {
      setError(err.message || "Login failed");
    } else {
      setError("Login failed");
    }
  } finally {
    setLoading(false);
  }
}
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

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block mb-2 text-sm font-medium text-[#1F2937]">
              Email Address / Phone Number
            </label>

         <input
type="text"
required  
autoComplete="username"
  value={emailOrPhone}
  onChange={(e) => setEmailOrPhone(e.target.value)}
  placeholder="Email or Phone Number"
  className="w-full rounded-xl border border-[#E5D6BC] bg-white px-4 h-14 text-[#1F2937] placeholder:text-gray-400 outline-none transition focus:border-[#A8741A] focus:ring-2 focus:ring-[#A8741A]/20"
/>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-[#1F2937]">
              Password
            </label>

            <div className="relative">
              <input
  type={showPassword ? "text" : "password"}
  required
  autoComplete="current-password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Enter your password"
  className="w-full rounded-xl border border-[#E5D6BC] bg-white px-4 h-14 text-[#1F2937] placeholder:text-gray-400 outline-none transition focus:border-[#A8741A] focus:ring-2 focus:ring-[#A8741A]/20"
/>

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</div>

          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-[#A8741A] hover:underline"
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
    ? "bg-gray-400 cursor-not-allowed"
    : "bg-[#A8741A] hover:bg-[#8C6416]"
}`}
>
{loading ? "Logging in..." : "Login"}
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