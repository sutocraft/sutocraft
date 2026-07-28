import { supabase } from "./supabase";

export type WebsiteProduct = {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  price: number;
  sale_price: number | null;
  featured: boolean;
  new_arrival: boolean;
  active: boolean;
  stock: number;
};

export async function getFeaturedProducts(): Promise<WebsiteProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as WebsiteProduct[];
}

export async function getNewArrivalProducts(): Promise<WebsiteProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("new_arrival", true)
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as WebsiteProduct[];
}

export async function getAllProducts(): Promise<WebsiteProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as WebsiteProduct[];
}