"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/auth";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from your current password.");
      return;
    }

    try {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user?.email) {
        throw new Error("Customer account email could not be found.");
      }

      // Re-authenticate with the current password before changing it.
      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email: user.email,
          password: currentPassword,
        });

      if (signInError) {
        throw new Error("Current password is incorrect.");
      }

      const { error: updateError } =
        await supabase.auth.updateUser({
          password: newPassword,
        });

      if (updateError) throw updateError;

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Password changed successfully.");

      setTimeout(() => {
        router.push("/account");
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Password change failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F4EC] py-14">
      <div className="mx-auto w-full max-w-2xl px-6">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[#183153]">
              Change Password
            </h1>
            <p className="mt-2 text-[#4B5563]">
              Update your customer account password securely.
            </p>
          </div>

          <Link
            href="/account"
            className="shrink-0 rounded-xl border border-[#E7D8BC] bg-white px-5 py-3 text-[#183153] transition hover:bg-[#A8741A] hover:text-white"
          >
            ← Back
          </Link>
        </div>

        <div className="rounded-2xl border border-[#E7D8BC] bg-white p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#183153]">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Enter current password"
                className="w-full rounded-xl border border-[#D9CDB8] bg-white px-4 py-3 text-[#183153] outline-none transition focus:border-[#A8741A] focus:ring-2 focus:ring-[#A8741A]/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#183153]">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Minimum 6 characters"
                className="w-full rounded-xl border border-[#D9CDB8] bg-white px-4 py-3 text-[#183153] outline-none transition focus:border-[#A8741A] focus:ring-2 focus:ring-[#A8741A]/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#183153]">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Re-enter new password"
                className="w-full rounded-xl border border-[#D9CDB8] bg-white px-4 py-3 text-[#183153] outline-none transition focus:border-[#A8741A] focus:ring-2 focus:ring-[#A8741A]/20"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                {success}
              </div>
            )}

            <div className="flex justify-end border-t border-[#E7D8BC] pt-6">
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-[#A8741A] px-8 py-3 font-semibold text-white transition hover:bg-[#8F6317] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Changing Password..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}