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

export async function loginAdmin(
  email: string,
  password: string
) {
  console.log("ADMIN STEP 1");

  const { data: authData, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  console.log("ADMIN STEP 2", { authData, error });

  if (error) {
    console.error("AUTH ERROR:", error);
    throw error;
  }

  if (!authData.user) {
    throw new Error("Login failed");
  }

  console.log("ADMIN STEP 3", authData.user.id);

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("id,email,role")
      .eq("id", authData.user.id)
      .single();

  console.log("ADMIN STEP 4", {
    profile,
    profileError,
  });

  if (profileError || !profile) {
    await supabase.auth.signOut();
    throw new Error("Profile not found");
  }

  console.log("ADMIN ROLE =", profile.role);

  if (
    profile.role !== "admin" &&
    profile.role !== "super_admin" &&
    profile.role !== "staff"
  ) {
    await supabase.auth.signOut();
    throw new Error("Access denied");
  }

  console.log("ADMIN STEP 5 SUCCESS");

  return authData.user;
}