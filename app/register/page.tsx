"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ImagePlus, X } from "lucide-react";
import AddressSelector from "@/app/components/website/AddressSelector";
import { registerCustomer } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleAvatarChange(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Profile picture must be 5 MB or smaller.");
      return;
    }

    setError("");
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  function clearAvatar() {
    setAvatarFile(null);
    setAvatarPreview("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) return setError("Full name is required.");
    if (!phone.trim()) return setError("Phone number is required.");
    if (!email.trim()) return setError("Email address is required.");
    if (!avatarFile) return setError("Profile picture is required.");
    if (!division || !district || !upazila) {
      return setError("Please complete Division, District and Upazila / Thana.");
    }
    if (!address.trim()) return setError("Full address is required.");
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true);

      await registerCustomer({
        fullName,
        phone,
        email,
        password,
        avatarFile,
        division,
        district,
        upazila,
        address,
        postalCode,
      });

      router.replace("/login?registered=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--theme-background)] px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--theme-primary)]">
            Welcome to SutoCraft
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Create Customer Account
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
            Your account will be used for orders, cart, queries and quotations.
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="rounded-3xl border border-[var(--theme-primary-border)] bg-white p-5 shadow-xl sm:p-8"
        >
          <section>
            <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
            <p className="mt-1 text-xs text-slate-500">All fields below are required.</p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Full Name *</span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  placeholder="Enter your full name"
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[var(--theme-primary)] focus:ring-4 focus:ring-[var(--theme-primary-ring)]"
                />
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-800">Phone Number *</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="01XXXXXXXXX"
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[var(--theme-primary)] focus:ring-4 focus:ring-[var(--theme-primary-ring)]"
                />
                <span className="mt-1 block text-[11px] text-slate-400">Phone cannot be edited later.</span>
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-800">Email Address *</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[var(--theme-primary)] focus:ring-4 focus:ring-[var(--theme-primary-ring)]"
                />
                <span className="mt-1 block text-[11px] text-slate-400">Email cannot be edited later.</span>
              </label>
            </div>
          </section>

          <section className="mt-8 border-t border-slate-100 pt-8">
            <h2 className="text-lg font-bold text-slate-900">Profile Picture *</h2>
            <div className="mt-4 flex flex-wrap items-center gap-5">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--theme-primary-border)] bg-[var(--theme-background)]">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile preview" className="h-full w-full object-cover" />
                ) : (
                  <ImagePlus className="text-[var(--theme-primary)]" size={30} />
                )}
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={clearAvatar}
                    className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white"
                    aria-label="Remove profile picture"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleAvatarChange(e.target.files?.[0])}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="rounded-xl border border-[var(--theme-primary-border)] px-5 py-3 text-sm font-semibold text-[var(--theme-primary)] hover:bg-[var(--theme-hover-background)]"
                >
                  {avatarPreview ? "Change Picture" : "Choose Picture"}
                </button>
                <p className="mt-2 text-xs text-slate-400">JPG, PNG or WebP. Maximum 5 MB.</p>
              </div>
            </div>
          </section>

          <section className="mt-8 border-t border-slate-100 pt-8">
            <h2 className="text-lg font-bold text-slate-900">Delivery Address *</h2>
            <div className="mt-5">
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
            </div>
            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">Full Address *</span>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                placeholder="House / Road / Area / Landmark"
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[var(--theme-primary)] focus:ring-4 focus:ring-[var(--theme-primary-ring)]"
              />
            </label>
          </section>

          <section className="mt-8 border-t border-slate-100 pt-8">
            <h2 className="text-lg font-bold text-slate-900">Password</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-800">Password *</span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Minimum 6 characters"
                    className="h-12 w-full rounded-xl border border-slate-200 px-4 pr-12 text-sm outline-none focus:border-[var(--theme-primary)] focus:ring-4 focus:ring-[var(--theme-primary-ring)]"
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-800">Confirm Password *</span>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    className="h-12 w-full rounded-xl border border-slate-200 px-4 pr-12 text-sm outline-none focus:border-[var(--theme-primary)] focus:ring-4 focus:ring-[var(--theme-primary-ring)]"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                    {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </label>
            </div>
          </section>

          {error && (
            <div className="mt-7 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 h-12 w-full rounded-xl bg-[var(--theme-primary)] px-5 text-sm font-bold text-white shadow-[0_8px_24px_var(--theme-primary-shadow)] transition hover:bg-[var(--theme-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Customer Account"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[var(--theme-primary)] hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}