import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type RegisterCustomerData = {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  avatarFile: File;
  division: string;
  district: string;
  upazila: string;
  address: string;
  postalCode: string;
};

function normalizePhone(value: string) {
  return value.trim().replace(/[^0-9+]/g, "");
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function getExtension(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase();

  return ext && /^[a-z0-9]+$/.test(ext) ? ext : "jpg";
}

async function uploadCustomerAvatar(userId: string, file: File) {
  const ext = getExtension(file);
  const path = `customers/${userId}.${ext}`;

  const { error } = await supabase.storage
    .from("products")
    .upload(path, file, {
      upsert: true,
      contentType: file.type || "image/jpeg",
      cacheControl: "3600",
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(path);

  return data.publicUrl;
}

/* =========================================================
   CUSTOMER REGISTRATION
   ========================================================= */

export async function registerCustomer(
  data: RegisterCustomerData
) {
  const fullName = data.fullName.trim();
  const phone = normalizePhone(data.phone);
  const email = normalizeEmail(data.email);

  if (!fullName) {
    throw new Error("Full name is required.");
  }

  if (!phone) {
    throw new Error("Phone number is required.");
  }

  if (!email) {
    throw new Error("Email is required.");
  }

  if (!data.password || data.password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  if (!data.avatarFile) {
    throw new Error("Profile picture is required.");
  }

  if (!data.division || !data.district || !data.upazila) {
    throw new Error("Complete your location information.");
  }

  if (!data.address.trim()) {
    throw new Error("Full address is required.");
  }

  /* -----------------------------
     Create Supabase Auth User
     ----------------------------- */

  const {
    data: authData,
    error: authError,
  } = await supabase.auth.signUp({
    email,
    password: data.password,
    options: {
      data: {
        full_name: fullName,
        phone,
        role: "customer",
      },
    },
  });

  if (authError) {
    throw authError;
  }

  if (!authData.user) {
    throw new Error("Customer account could not be created.");
  }

  /*
   * Avatar upload requires an active authenticated
   * session with the current Supabase setup.
   */

  if (!authData.session) {
    await supabase.auth.signOut();

    throw new Error(
      "Registration needs an active session to upload the required profile picture. Please enable automatic email confirmation in Supabase Auth, then register again."
    );
  }

  /* -----------------------------
     Upload Profile Picture
     ----------------------------- */

  let avatarUrl: string;

  try {
    avatarUrl = await uploadCustomerAvatar(
      authData.user.id,
      data.avatarFile
    );
  } catch (error) {
    await supabase.auth.signOut();

    throw new Error(
      error instanceof Error
        ? `Profile picture upload failed: ${error.message}`
        : "Profile picture upload failed."
    );
  }

  /* -----------------------------
     Update Customer Profile
     ----------------------------- */

  const {
    error: profileError,
  } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone,
      email,
      avatar: avatarUrl,
      division: data.division,
      district: data.district,
      upazila: data.upazila,
      address: data.address.trim(),
      postal_code: data.postalCode.trim(),
      role: "customer",
    })
    .eq("id", authData.user.id);

  if (profileError) {
    await supabase.auth.signOut();
    throw profileError;
  }

  /* Registration complete */
  await supabase.auth.signOut();

  return authData.user;
}

/* =========================================================
   CUSTOMER LOGIN
   Email OR Phone
   ========================================================= */

export async function loginCustomer(
  emailOrPhone: string,
  password: string
) {
  const identifier = emailOrPhone.trim();

  if (!identifier) {
    throw new Error("Email or phone number is required.");
  }

  if (!password) {
    throw new Error("Password is required.");
  }

  let email = identifier;

  /* Login using phone number */
  if (!identifier.includes("@")) {
    const {
      data,
      error,
    } = await supabase.rpc(
      "lookup_customer_email_by_phone",
      {
        phone_input: normalizePhone(identifier),
      }
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("Phone number not found.");
    }

    email = String(data);
  }

  /* Login using Supabase Auth */
  const {
    data: authData,
    error: authError,
  } =
    await supabase.auth.signInWithPassword({
      email: normalizeEmail(email),
      password,
    });

  if (authError) {
    throw authError;
  }

  if (!authData.user) {
    throw new Error("Login failed.");
  }

  /* -----------------------------
     Verify Customer Profile
     ----------------------------- */

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select(
      "id,full_name,phone,email,avatar,role,address,division,district,upazila,postal_code"
    )
    .eq("id", authData.user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();

    throw new Error("Customer profile not found.");
  }

  if (profile.role !== "customer") {
    await supabase.auth.signOut();

    throw new Error(
      "This login is for customer accounts only."
    );
  }

  return authData.user;
}

/* =========================================================
   CUSTOMER LOGOUT
   ========================================================= */

export async function logoutCustomer() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

/* =========================================================
   CURRENT USER
   ========================================================= */

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

/* =========================================================
   CURRENT PROFILE
   ========================================================= */

export async function getCurrentProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const {
    data,
    error,
  } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/*
 * Backward-compatible alias.
 * Existing Header / Account code can continue using this.
 */

export async function getCurrentUserProfile() {
  return getCurrentProfile();
}

/* =========================================================
   UPDATE CUSTOMER PROFILE
   ========================================================= */

export async function updateCurrentProfile(data: {
  full_name?: string;
  division: string;
  district: string;
  upazila: string;
  address: string;
  postal_code: string;
  avatar?: string;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found.");
  }

  const update: Record<string, string> = {
    division: data.division,
    district: data.district,
    upazila: data.upazila,
    address: data.address.trim(),
    postal_code: data.postal_code.trim(),
  };

  if (data.full_name !== undefined) {
    update.full_name = data.full_name.trim();
  }

  if (data.avatar !== undefined) {
    update.avatar = data.avatar;
  }

  const { error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", user.id);

  if (error) {
    throw error;
  }

  return true;
}

/* =========================================================
   UPDATE CUSTOMER AVATAR
   ========================================================= */

export async function uploadAvatar(file: File) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found.");
  }

  const avatarUrl = await uploadCustomerAvatar(
    user.id,
    file
  );

  const { error } = await supabase
    .from("profiles")
    .update({
      avatar: avatarUrl,
    })
    .eq("id", user.id);

  if (error) {
    throw error;
  }

  return avatarUrl;
}

/* =========================================================
   ADMIN LOGIN
   ========================================================= */

export async function loginAdmin(
  email: string,
  password: string
) {
  const {
    data: authData,
    error: authError,
  } =
    await supabase.auth.signInWithPassword({
      email: normalizeEmail(email),
      password,
    });

  if (authError) {
    throw authError;
  }

  if (!authData.user) {
    throw new Error("Login failed.");
  }

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select("id,email,role")
    .eq("id", authData.user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();

    throw new Error("Profile not found.");
  }

  if (
    !["admin", "super_admin", "staff"].includes(
      profile.role
    )
  ) {
    await supabase.auth.signOut();

    throw new Error("Access denied.");
  }

  return authData.user;
}