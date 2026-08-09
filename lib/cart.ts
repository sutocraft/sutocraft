import { supabase } from "./supabase";

async function getCurrentUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

console.count("addToCart()");

export async function addToCart({
  productId,
  sizeId,

  quantity,
}: {
  
  productId: string;
  sizeId?: string | null;
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

 

  const { data: existing, error: existingError } =
    await query.maybeSingle();

  if (existingError) throw existingError;

  if (existing) {
    const { error } = await supabase
      .from("cart_items")
      .update({
        quantity: existing.quantity + quantity,
      })
      .eq("id", existing.id);

    if (error) throw error;

    return true;
  }

  const { error } = await supabase
    .from("cart_items")
    .insert({
      user_id: userId,
      session_id: null,
      product_id: productId,
      size_id: sizeId ?? null,

      quantity,
    });

  if (error) throw error;

  return true;
}

export async function getCartItems() {
  const userId = await getCurrentUserId();

  if (!userId) return [];

  const { data, error } = await supabase
    .from("cart_items")
    .select(`
  *,
  products (
    *
  ),
  sizes (
    id,
    name
  )
`)
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data ?? [];
}

export async function getCartCount() {
  const userId = await getCurrentUserId();

  if (!userId) return 0;

  const { data, error } = await supabase
    .from("cart_items")
    .select("quantity")
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    return 0;
  }

  return (data ?? []).reduce(
    (sum: number, item: any) => sum + (item.quantity ?? 0),
    0
  );
}

export async function updateCartQuantity(
  id: string,
  quantity: number
) {
  if (quantity <= 0) {
    return removeCartItem(id);
  }

  const { error } = await supabase
    .from("cart_items")
    .update({
      quantity,
    })
    .eq("id", id);

  if (error) throw error;

  return true;
}

export async function removeCartItem(id: string) {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return true;
}

export async function clearCart() {
  const userId = await getCurrentUserId();

  if (!userId) return;

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId);

  if (error) throw error;

  return true;
}

