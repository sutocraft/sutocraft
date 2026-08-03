import { supabase } from "./supabase";

export type HeaderSettings = {
  website_name: string;
  logo_url: string;
  theme_color: string;
};

export async function getHeaderSettings(): Promise<HeaderSettings> {
  const { data } = await supabase
    .from("website_settings")
    .select(
      `
      website_name,
      logo_url,
      theme_color
      `
    )
    .eq("id", 1)
    .single();

  return {
    website_name: data?.website_name ?? "SutoCraft",
    logo_url: data?.logo_url ?? "",
    theme_color: data?.theme_color ?? "#98691D",
  };
}