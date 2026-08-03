"use client";

import { useEffect, useState } from "react";
import ImageUploader from "@/app/components/admin/ImageUploader";

import {
  defaultSettings,
  getWebsiteSettings,
  updateWebsiteSettings,
  WebsiteSettings,
} from "@/lib/settings";

export default function SettingsPage() {

  const [settings, setSettings] =
    useState<WebsiteSettings>(defaultSettings);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {

    setLoading(true);

    const { data, error } =
      await getWebsiteSettings();

    if (error) {

      console.error(error);

      alert("Failed to load settings.");

    } else {

      setSettings(data);

    }

    setLoading(false);

  }

  async function handleSave() {

    try {

      setSaving(true);

      const { error } =
        await updateWebsiteSettings(settings);

      if (error) {

        console.error(error);

        alert(error.message);

        return;

      }

      alert("Website Settings Saved Successfully.");

      await loadSettings();

    } finally {

      setSaving(false);

    }

  }

  function handleInput(

    e: React.ChangeEvent<

      HTMLInputElement |

      HTMLTextAreaElement

    >

  ) {

    const { name, value } = e.target;

    setSettings(prev => ({

      ...prev,

      [name]: value,

    }));

  }

  function handleCheckbox(

    e: React.ChangeEvent<HTMLInputElement>

  ) {

    const { name, checked } = e.target;

    setSettings(prev => ({

      ...prev,

      [name]: checked,

    }));

  }

  if (loading) {

    return (

      <div className="p-8">

        Loading...

      </div>

    );

  }

  return (

<div className="p-8 max-w-7xl mx-auto">

    <div className="mb-8 flex items-center justify-between">

        <div>

            <h1 className="text-3xl font-bold text-white">

                Website Settings

            </h1>

            <p className="mt-1 text-sm text-gray-400">

                Configure your website information, branding and SEO.

            </p>

        </div>

        <button

            type="button"

            onClick={handleSave}

            disabled={saving}

            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"

        >

            {saving ? "Saving..." : "Save Settings"}

        </button>

    </div>



    <div className="grid gap-6 lg:grid-cols-2">



        <div className="rounded-xl border border-gray-700 bg-gray-900 p-6">

            <h2 className="mb-6 text-xl font-semibold text-white">

                General Information

            </h2>

            <div className="space-y-5">

                <div>

                    <label className="mb-2 block text-sm font-medium">

                        Website Name

                    </label>

                    <input

                        name="website_name"

                        value={settings.website_name ?? ""}

                        onChange={handleInput}

                        className="w-full rounded-lg border border-gray-700 bg-black p-3"

                    />

                </div>



                <div>

                    <label className="mb-2 block text-sm font-medium">

                        Company Name

                    </label>

                    <input

                        name="company_name"

                        value={settings.company_name ?? ""}

                        onChange={handleInput}

                        className="w-full rounded-lg border border-gray-700 bg-black p-3"

                    />

                </div>



                <div className="grid grid-cols-2 gap-4">

                    <div>

                        <label className="mb-2 block text-sm">

                            Theme Color

                        </label>

                        <input

                            name="theme_color"

                            value={settings.theme_color ?? ""}

                            onChange={handleInput}

                            className="w-full rounded-lg border border-gray-700 bg-black p-3"

                        />

                    </div>



                    <div>

                        <label className="mb-2 block text-sm">

                            Currency

                        </label>

                        <input

                            name="currency"

                            value={settings.currency ?? ""}

                            onChange={handleInput}

                            className="w-full rounded-lg border border-gray-700 bg-black p-3"

                        />

                    </div>

                </div>



                <div className="grid grid-cols-2 gap-4">

                    <div>

                        <label className="mb-2 block text-sm">

                            Currency Symbol

                        </label>

                        <input

                            name="currency_symbol"

                            value={settings.currency_symbol ?? ""}

                            onChange={handleInput}

                            className="w-full rounded-lg border border-gray-700 bg-black p-3"

                        />

                    </div>



                    <div>

                        <label className="mb-2 block text-sm">

                            Timezone

                        </label>

                        <input

                            name="timezone"

                            value={settings.timezone ?? ""}

                            onChange={handleInput}

                            className="w-full rounded-lg border border-gray-700 bg-black p-3"

                        />

                    </div>

                </div>

            </div>

        </div>



        <div className="rounded-xl border border-gray-700 bg-gray-900 p-6">

            <h2 className="mb-6 text-xl font-semibold text-white">

                Logo & Branding

            </h2>

            <div className="space-y-8">

                <ImageUploader

                    label="Website Logo"

                    folder="website/logo"

                    value={settings.logo_url ?? ""}

                    onChange={(url) =>

                        setSettings((prev) => ({

                            ...prev,

                            logo_url: url,

                        }))

                    }

                />



                <ImageUploader

                    label="Website Favicon"

                    folder="website/favicon"

                    value={settings.favicon_url ?? ""}

                    onChange={(url) =>

                        setSettings((prev) => ({

                            ...prev,

                            favicon_url: url,

                        }))

                    }

                />

            </div>

        </div>

    </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

        {/* Contact Information */}

        <div className="rounded-xl border border-gray-700 bg-gray-900 p-6">

            <h2 className="mb-6 text-xl font-semibold text-white">

                Contact Information

            </h2>

            <div className="space-y-4">

                <div className="grid grid-cols-2 gap-4">

                    <div>

                        <label className="mb-2 block text-sm">

                            Phone

                        </label>

                        <input
                            name="phone"
                            value={settings.phone ?? ""}
                            onChange={handleInput}
                            className="w-full rounded-lg border border-gray-700 bg-black p-3"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm">

                            WhatsApp

                        </label>

                        <input
                            name="whatsapp"
                            value={settings.whatsapp ?? ""}
                            onChange={handleInput}
                            className="w-full rounded-lg border border-gray-700 bg-black p-3"
                        />

                    </div>

                </div>

                <div className="grid grid-cols-2 gap-4">

                    <div>

                        <label className="mb-2 block text-sm">

                            Telephone

                        </label>

                        <input
                            name="telephone"
                            value={settings.telephone ?? ""}
                            onChange={handleInput}
                            className="w-full rounded-lg border border-gray-700 bg-black p-3"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm">

                            Email

                        </label>

                        <input
                            name="email"
                            value={settings.email ?? ""}
                            onChange={handleInput}
                            className="w-full rounded-lg border border-gray-700 bg-black p-3"
                        />

                    </div>

                </div>

                <div className="grid grid-cols-2 gap-4">

                    <div>

                        <label className="mb-2 block text-sm">

                            Office Time

                        </label>

                        <input
                            name="office_time"
                            value={settings.office_time ?? ""}
                            onChange={handleInput}
                            className="w-full rounded-lg border border-gray-700 bg-black p-3"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm">

                            Google Map

                        </label>

                        <input
                            name="google_map"
                            value={settings.google_map ?? ""}
                            onChange={handleInput}
                            className="w-full rounded-lg border border-gray-700 bg-black p-3"
                        />

                    </div>

                </div>

                <div>

                    <label className="mb-2 block text-sm">

                        Address

                    </label>

                    <textarea
                        name="address"
                        value={settings.address ?? ""}
                        onChange={handleInput}
                        rows={4}
                        className="w-full rounded-lg border border-gray-700 bg-black p-3"
                    />

                </div>

            </div>

        </div>

        {/* Social Media */}

        <div className="rounded-xl border border-gray-700 bg-gray-900 p-6">

            <h2 className="mb-6 text-xl font-semibold text-white">

                Social Media

            </h2>

            <div className="space-y-4">

                <div className="grid grid-cols-2 gap-4">

                    <input
                        placeholder="Facebook"
                        name="facebook"
                        value={settings.facebook ?? ""}
                        onChange={handleInput}
                        className="rounded-lg border border-gray-700 bg-black p-3"
                    />

                    <input
                        placeholder="Messenger"
                        name="messenger"
                        value={settings.messenger ?? ""}
                        onChange={handleInput}
                        className="rounded-lg border border-gray-700 bg-black p-3"
                    />

                </div>

                <div className="grid grid-cols-2 gap-4">

                    <input
                        placeholder="Instagram"
                        name="instagram"
                        value={settings.instagram ?? ""}
                        onChange={handleInput}
                        className="rounded-lg border border-gray-700 bg-black p-3"
                    />

                    <input
                        placeholder="YouTube"
                        name="youtube"
                        value={settings.youtube ?? ""}
                        onChange={handleInput}
                        className="rounded-lg border border-gray-700 bg-black p-3"
                    />

                </div>

                <div className="grid grid-cols-2 gap-4">

                    <input
                        placeholder="LinkedIn"
                        name="linkedin"
                        value={settings.linkedin ?? ""}
                        onChange={handleInput}
                        className="rounded-lg border border-gray-700 bg-black p-3"
                    />

                    <input
                        placeholder="TikTok"
                        name="tiktok"
                        value={settings.tiktok ?? ""}
                        onChange={handleInput}
                        className="rounded-lg border border-gray-700 bg-black p-3"
                    />

                </div>

            </div>

        </div>

    </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

        {/* Business Information */}

        <div className="rounded-xl border border-gray-700 bg-gray-900 p-6">

            <h2 className="mb-6 text-xl font-semibold text-white">

                Business Information

            </h2>

            <div className="space-y-4">

                <div className="grid grid-cols-2 gap-4">

                    <div>

                        <label className="mb-2 block text-sm">

                            Company BIN

                        </label>

                        <input
                            name="company_bin"
                            value={settings.company_bin ?? ""}
                            onChange={handleInput}
                            className="w-full rounded-lg border border-gray-700 bg-black p-3"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm">

                            Trade License

                        </label>

                        <input
                            name="trade_license"
                            value={settings.trade_license ?? ""}
                            onChange={handleInput}
                            className="w-full rounded-lg border border-gray-700 bg-black p-3"
                        />

                    </div>

                </div>

                <div className="grid grid-cols-2 gap-4">

                    <div>

                        <label className="mb-2 block text-sm">

                            VAT Number

                        </label>

                        <input
                            name="vat_number"
                            value={settings.vat_number ?? ""}
                            onChange={handleInput}
                            className="w-full rounded-lg border border-gray-700 bg-black p-3"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm">

                            TIN Number

                        </label>

                        <input
                            name="tin_number"
                            value={settings.tin_number ?? ""}
                            onChange={handleInput}
                            className="w-full rounded-lg border border-gray-700 bg-black p-3"
                        />

                    </div>

                </div>

                <div>

                    <label className="mb-2 block text-sm">

                        Invoice Prefix

                    </label>

                    <input
                        name="invoice_prefix"
                        value={settings.invoice_prefix ?? ""}
                        onChange={handleInput}
                        className="w-full rounded-lg border border-gray-700 bg-black p-3"
                    />

                </div>

            </div>

        </div>



        {/* SEO Information */}

        <div className="rounded-xl border border-gray-700 bg-gray-900 p-6">

            <h2 className="mb-6 text-xl font-semibold text-white">

                SEO Information

            </h2>

            <div className="space-y-4">

                <div>

                    <label className="mb-2 block text-sm">

                        Meta Title

                    </label>

                    <input
                        name="meta_title"
                        value={settings.meta_title ?? ""}
                        onChange={handleInput}
                        className="w-full rounded-lg border border-gray-700 bg-black p-3"
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm">

                        Meta Description

                    </label>

                    <textarea
                        name="meta_description"
                        value={settings.meta_description ?? ""}
                        onChange={handleInput}
                        rows={4}
                        className="w-full rounded-lg border border-gray-700 bg-black p-3"
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm">

                        Meta Keywords

                    </label>

                    <textarea
                        name="meta_keywords"
                        value={settings.meta_keywords ?? ""}
                        onChange={handleInput}
                        rows={3}
                        className="w-full rounded-lg border border-gray-700 bg-black p-3"
                    />

                </div>

                <ImageUploader

                    label="Open Graph Image"

                    folder="website/og"

                    value={settings.og_image ?? ""}

                    onChange={(url) =>
                        setSettings((prev) => ({
                            ...prev,
                            og_image: url,
                        }))
                    }

                />

            </div>

        </div>

    </div>

        <div className="mt-6 rounded-xl border border-gray-700 bg-gray-900 p-6">

        <h2 className="mb-6 text-xl font-semibold text-white">

            Extra Information

        </h2>

        <div className="grid gap-6 lg:grid-cols-2">

            <div>

                <label className="mb-3 block text-sm font-medium">

                    Maintenance Mode

                </label>

                <label className="flex cursor-pointer items-center gap-3">

                    <input

                        type="checkbox"

                        name="maintenance_mode"

                        checked={settings.maintenance_mode ?? false}

                        onChange={handleCheckbox}

                        className="h-5 w-5"

                    />

                    <span>

                        Enable Maintenance Mode

                    </span>

                </label>

            </div>

            <div className="flex items-end justify-end">

                <button

                    type="button"

                    onClick={handleSave}

                    disabled={saving}

                    className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"

                >

                    {saving

                        ? "Saving Settings..."

                        : "Save Settings"}

                </button>

            </div>

        </div>

    </div>

</div>

);
}