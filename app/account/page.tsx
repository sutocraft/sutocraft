"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/auth";

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUser(user);
    }

    loadUser();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F4EC] flex items-center justify-center text-gray-900">
      <div className="bg-white text-gray-900 rounded-xl shadow-lg p-8 w-[500px]">

        <h1 className="text-3xl font-bold text-[#183153] mb-6">
          My Account
        </h1>

        <p className="text-gray-700">
          <b>Email:</b> {user.email}
        </p>

        <p className="mt-2 text-gray-700">
          <b>User ID:</b> {user.id}
        </p>

        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-[#A8741A] text-white py-3 rounded-xl"
        >
          Logout
        </button>

      </div>
    </main>
  );
}