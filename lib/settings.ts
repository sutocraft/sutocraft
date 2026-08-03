import { supabase } from "./supabase";

export interface WebsiteSettings {
  id?: number;

  website_name: string;
  company_name: string;

  logo_url: string;
  favicon_url: string;

  theme_color: string;

  currency: string;
  currency_symbol: string;

  company_bin: string;
  trade_license: string;
  vat_number: string;
  tin_number: string;
  invoice_prefix: string;

  timezone: string;

  maintenance_mode: boolean;

  phone: string;
  whatsapp: string;
  telephone: string;
  email: string;

  address: string;
  google_map: string;
  office_time: string;

  facebook: string;
  messenger: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  linkedin: string;

  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_image: string;

  created_at?: string;
  updated_at?: string;

    // Hero Section
  hero_subtitle: string;
  hero_title: string;
  hero_description: string;

  hero_button_1_text: string;
  hero_button_1_link: string;

  hero_button_2_text: string;
  hero_button_2_link: string;

  hero_image: string;

show_hero: boolean;

hero_auto_slide: boolean;

hero_slide_interval: number;

hero_transition_speed: number;

hero_max_products: number;
}

export const defaultSettings: WebsiteSettings = {
  website_name: "",
  company_name: "",

  logo_url: "",
  favicon_url: "",

  theme_color: "#2563eb",

  currency: "BDT",
  currency_symbol: "৳",

  company_bin: "",
  trade_license: "",
  vat_number: "",
  tin_number: "",
  invoice_prefix: "STC",

  timezone: "Asia/Dhaka",

  maintenance_mode: false,

  phone: "",
  whatsapp: "",
  telephone: "",
  email: "",

  address: "",
  google_map: "",
  office_time: "",

  facebook: "",
  messenger: "",
  instagram: "",
  tiktok: "",
  youtube: "",
  linkedin: "",

  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  og_image: "",

    hero_subtitle: "",
  hero_title: "",
  hero_description: "",

  hero_button_1_text: "",
  hero_button_1_link: "",

  hero_button_2_text: "",
  hero_button_2_link: "",

  hero_image: "",

show_hero: true,

hero_auto_slide: true,

hero_slide_interval: 5,

hero_transition_speed: 600,

hero_max_products: 5,
};

export async function getWebsiteSettings() {
  const { data, error } = await supabase
    .from("website_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    return {
      data: defaultSettings,
      error,
    };
  }

  const merged = {
  ...defaultSettings,
  ...(data ?? {}),
};

Object.keys(merged).forEach((key) => {
  if (merged[key as keyof typeof merged] === null) {
    (merged as any)[key] = "";
  }
});

merged.maintenance_mode =
  Boolean(merged.maintenance_mode);

return {
  data: merged,
  error: null,
};
}

export async function updateWebsiteSettings(
  settings: WebsiteSettings
) {
  const {
  id,
  created_at,
  updated_at,
  ...payload
} = settings;

const updateData = {
  ...payload,
  updated_at: new Date().toISOString(),
};

  const { data: existing } = await supabase
    .from("website_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (!existing) {
    return await supabase
      .from("website_settings")
      .insert(updateData)
      .select()
      .single();
  }

  return await supabase
    .from("website_settings")
    .update(updateData)
    .eq("id", existing.id)
    .select()
    .single();
}