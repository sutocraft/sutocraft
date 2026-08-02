import { supabase } from "./supabase";

export type WebsiteProduct = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  price: number;
  sale_price: number | null;
discount_percentage: number;
  featured: boolean;
  new_arrival: boolean;
  active: boolean;
  stock: number;
  short_description: string | null;
description: string | null;
specification: string | null;

sku: string | null;

brand_id: string | null;
category_id: string | null;
sub_category_id: string | null;

color_ids: string[] | null;
size_ids: string[] | null;
brand?: {
  name: string;
};

category?: {
  name: string;
};

sub_category?: {
  name: string;
};
sizes?: {
  id: string;
  name: string;
}[];

colors?: {
  id: string;
  name: string;
}[];
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

export async function getProductBySlug(
  slug: string
): Promise<WebsiteProduct | null> {
  const { data, error } = await supabase
    .from("products")
    .select(`
  *,
  brand:brands(name),
  category:categories(name),
  sub_category:sub_categories(name)
`)
.eq("slug", decodeURIComponent(slug))
.maybeSingle();

  if (error) {
  console.log("Slug =", slug);
  console.log(error);
  return null;
}

  console.log("Product =", data);

if (!data) return null;

// Load Sizes
if (data.size_ids?.length) {
  const { data: sizes } = await supabase
    .from("sizes")
    .select("id,name")
    .in("id", data.size_ids);

  data.sizes = sizes || [];
} else {
  data.sizes = [];
}

// Load Colors
if (data.color_ids?.length) {
  const { data: colors } = await supabase
    .from("colors")
    .select("id,name")
    .in("id", data.color_ids);

  data.colors = colors || [];
} else {
  data.colors = [];
}

return data as WebsiteProduct;
}

export async function getProductGallery(productId: string) {
  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("sort_order");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}