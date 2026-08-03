import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function registerCustomer(data: {
  fullName: string;
  phone: string;
  email: string;
  password: string;
}) {
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
        phone: data.phone,
        role: "customer",
      },
    },
  });

  if (error) throw error;

  if (!authData.user) {
    throw new Error("User not created");
  }

  return authData.user;
}

export async function loginCustomer(
  emailOrPhone: string,
  password: string
) {
  let email = emailOrPhone.trim();

  // Phone login
  if (!email.includes("@")) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("email")
      .eq("phone", email)
      .single();

    if (error || !profile) {
      throw new Error("Phone number not found");
    }

    email = profile.email;
  }

  // Email login
  const { data: authData, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) throw error;

  if (!authData.user) {
    throw new Error("Login failed");
  }

  return authData.user;
}

export async function logoutCustomer() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}