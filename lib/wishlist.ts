import { supabase } from "@/lib/auth";

async function getCurrentUserId() {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return user.id;

}

// ==============================
// Get Wishlist
// ==============================

export async function getWishlist() {
  const userId = await getCurrentUserId();

if (!userId) {
  return [];
}


  const { data, error } = await supabase
    .from("wishlists")
    .select(`
      *,
      products (*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

// ==============================
// Wishlist Count
// ==============================

export async function getWishlistCount() {
  const userId = await getCurrentUserId();

if (!userId) {
  return 0;
}


  const { count, error } = await supabase
    .from("wishlists")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("user_id", userId);

  if (error) throw error;

  return count ?? 0;
}

// ==============================
// Check Already Wishlisted
// ==============================

export async function isWishlisted(productId: string) {
 const userId = await getCurrentUserId();

if (!userId) {
  return false;
}

const { data, error } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (error) throw error;

  return !!data;
}

// ==============================
// Add Wishlist
// ==============================

export async function addToWishlist(productId: string) {
  const userId = await getCurrentUserId();

if (!userId) {
  throw new Error("LOGIN_REQUIRED");
}


  const { error } = await supabase
    .from("wishlists")
    .insert({
      user_id: userId,
      product_id: productId,
    });

  if (error) throw error;

  return true;
}

// ==============================
// Remove Wishlist
// ==============================

export async function removeFromWishlist(productId: string) {
  const userId = await getCurrentUserId();

if (!userId) {
  return false;
}

const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) throw error;

  return true;
}

// ==============================
// Toggle Wishlist
// ==============================

export async function toggleWishlist(productId: string) {
  const exists = await isWishlisted(productId);

  if (exists) {
    await removeFromWishlist(productId);
    return false;
  }

  await addToWishlist(productId);
  return true;
}