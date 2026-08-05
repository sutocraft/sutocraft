import { supabase } from "./supabase";

async function getCurrentUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

export async function addToCart({
  productId,
  sizeId,
  colorId,
  quantity,
}: {
  productId: string;
  sizeId: string;
  colorId: string;
  quantity: number;
}) {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Please login first.");
  }

  let query = supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (sizeId) {
    query = query.eq("size_id", sizeId);
  } else {
    query = query.is("size_id", null);
  }

  if (colorId) {
    query = query.eq("color_id", colorId);
  } else {
    query = query.is("color_id", null);
  }

  const { data: existing, error: existingError } =
    await query.maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existing) {
    const { data, error } = await supabase
      .from("cart_items")
      .update({
        quantity: existing.quantity + quantity,
      })
      .eq("id", existing.id)
      .select();

    if (error) throw error;

    return { data, error: null };
  }

  const { data, error } = await supabase
    .from("cart_items")
    .insert({
      user_id: userId,
      session_id: null,
      product_id: productId,
      size_id: sizeId || null,
      color_id: colorId || null,
      quantity,
    })
    .select();

  if (error) {
    throw error;
  }

  return { data, error: null };
}

export async function getCartCount(userId: string) {
  const { count, error } = await supabase
    .from("cart_items")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    return 0;
  }

  return count ?? 0;
}

export async function clearCart(userId: string) {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}

export async function getCartItems(userId: string) {
  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `
      *,
      products (*)
    `
    )
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return data ?? [];
}