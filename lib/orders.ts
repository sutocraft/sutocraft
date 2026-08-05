import { supabase } from "./auth";

export async function getOrders() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
  .from("orders")
  .select("*")
  .order("created_at", { ascending: false });

console.log("Current User:", user.id);
console.log("Orders:", data);
console.log("Orders Error:", error);

  if (error) throw error;

  return data;
}

export async function getOrdersCount() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return 0;

  const { count, error } = await supabase
    .from("orders")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("user_id", user.id);

  if (error) throw error;

  return count ?? 0;
}

export async function getOrderById(id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) throw error;

  return data;
}