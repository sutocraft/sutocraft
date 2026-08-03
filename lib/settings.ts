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