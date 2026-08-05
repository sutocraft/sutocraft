"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getHeaderSettings } from "@/lib/header";

type ThemeContextType = {
  themeColor: string;
  websiteName: string;
  logoUrl: string;
  loading: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  themeColor: "#98691D",
  websiteName: "SutoCraft",
  logoUrl: "",
  loading: true,
});

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [themeColor, setThemeColor] = useState("#98691D");
  const [websiteName, setWebsiteName] = useState("SutoCraft");
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const settings = await getHeaderSettings();

      setThemeColor(settings.theme_color || "#98691D");
      setWebsiteName(settings.website_name || "SutoCraft");
      setLogoUrl(settings.logo_url || "");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        themeColor,
        websiteName,
        logoUrl,
        loading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}