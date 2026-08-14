"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { getHeaderSettings } from "@/lib/header";


type ThemeContextType = {
  themeColor: string;
  websiteName: string;
  logoUrl: string;
  loading: boolean;
};


const DEFAULT_THEME_COLOR = "#98691D";


const ThemeContext =
  createContext<ThemeContextType>({
    themeColor: DEFAULT_THEME_COLOR,
    websiteName: "SutoCraft",
    logoUrl: "",
    loading: true,
  });


/* =====================================================
   COLOR NORMALIZER
   ===================================================== */

function normalizeHexColor(
  value: string
): string {

  const color =
    value?.trim() || "";


  /* 6 digit */

  if (
    /^#[0-9A-Fa-f]{6}$/.test(color)
  ) {
    return color;
  }


  /* 3 digit */

  if (
    /^#[0-9A-Fa-f]{3}$/.test(color)
  ) {

    return (
      "#" +
      color[1] +
      color[1] +
      color[2] +
      color[2] +
      color[3] +
      color[3]
    );
  }


  return DEFAULT_THEME_COLOR;
}


/* =====================================================
   APPLY GLOBAL THEME VARIABLES
   ===================================================== */

function applyThemeVariables(
  themeColor: string
) {

  if (
    typeof document === "undefined"
  ) {
    return;
  }


  const root =
    document.documentElement;


  const color =
    normalizeHexColor(
      themeColor
    );


  /* =====================================================
     MAIN THEME
     ===================================================== */

  root.style.setProperty(
    "--theme-color",
    color
  );

  root.style.setProperty(
    "--theme-primary",
    color
  );


  /* =====================================================
     LIGHT SHADES
     ===================================================== */

  root.style.setProperty(
    "--theme-primary-light",
    `color-mix(in srgb, ${color} 35%, white)`
  );

  root.style.setProperty(
    "--theme-primary-soft",
    `color-mix(in srgb, ${color} 10%, white)`
  );


  /* =====================================================
     BACKGROUNDS
     ===================================================== */

  root.style.setProperty(
    "--theme-background",
    `color-mix(in srgb, ${color} 4%, white)`
  );

  root.style.setProperty(
    "--theme-background-soft",
    `color-mix(in srgb, ${color} 7%, white)`
  );


  /* =====================================================
     BORDERS
     ===================================================== */

  root.style.setProperty(
    "--theme-primary-border",
    `color-mix(in srgb, ${color} 20%, white)`
  );

  root.style.setProperty(
    "--theme-border-light",
    `color-mix(in srgb, ${color} 12%, white)`
  );


  /* =====================================================
     HOVER
     ===================================================== */

  root.style.setProperty(
    "--theme-primary-hover",
    `color-mix(in srgb, ${color} 88%, black)`
  );

  root.style.setProperty(
    "--theme-hover-background",
    `color-mix(in srgb, ${color} 8%, white)`
  );


  /* =====================================================
     DARK THEME VERSION
     ===================================================== */

  root.style.setProperty(
    "--theme-primary-dark",
    `color-mix(in srgb, ${color} 72%, black)`
  );


  /* =====================================================
     TINT COLORS
     ===================================================== */

  root.style.setProperty(
    "--theme-color-05",
    `color-mix(in srgb, ${color} 5%, transparent)`
  );

  root.style.setProperty(
    "--theme-color-10",
    `color-mix(in srgb, ${color} 10%, transparent)`
  );

  root.style.setProperty(
    "--theme-color-15",
    `color-mix(in srgb, ${color} 15%, transparent)`
  );

  root.style.setProperty(
    "--theme-color-20",
    `color-mix(in srgb, ${color} 20%, transparent)`
  );

  root.style.setProperty(
    "--theme-color-30",
    `color-mix(in srgb, ${color} 30%, transparent)`
  );

  root.style.setProperty(
    "--theme-color-40",
    `color-mix(in srgb, ${color} 40%, transparent)`
  );

  root.style.setProperty(
    "--theme-color-50",
    `color-mix(in srgb, ${color} 50%, transparent)`
  );

  root.style.setProperty(
    "--theme-color-80",
    `color-mix(in srgb, ${color} 80%, transparent)`
  );


  /* =====================================================
     RING
     ===================================================== */

  root.style.setProperty(
    "--theme-primary-ring",
    `color-mix(in srgb, ${color} 30%, transparent)`
  );


  /* =====================================================
     SHADOW
     ===================================================== */

  root.style.setProperty(
    "--theme-primary-shadow",
    `color-mix(in srgb, ${color} 18%, transparent)`
  );


  /* =====================================================
     TRANSPARENT
     ===================================================== */

  root.style.setProperty(
    "--theme-primary-transparent",
    "transparent"
  );


  /* =====================================================
     READABLE TEXT COLORS
     -----------------------------------------------------
     These do NOT become white when browser/system is
     using dark mode.
     ===================================================== */

  root.style.setProperty(
    "--text-primary",
    "#1f2937"
  );

  root.style.setProperty(
    "--text-secondary",
    "#374151"
  );

  root.style.setProperty(
    "--text-muted",
    "#6b7280"
  );

  root.style.setProperty(
    "--text-light",
    "#9ca3af"
  );

  root.style.setProperty(
    "--text-inverse",
    "#ffffff"
  );
}


/* =====================================================
   THEME PROVIDER
   ===================================================== */

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [
    themeColor,
    setThemeColor,
  ] = useState(
    DEFAULT_THEME_COLOR
  );


  const [
    websiteName,
    setWebsiteName,
  ] = useState(
    "SutoCraft"
  );


  const [
    logoUrl,
    setLogoUrl,
  ] = useState("");


  const [
    loading,
    setLoading,
  ] = useState(true);


  /* =====================================================
     LOAD SETTINGS
     ===================================================== */

  useEffect(() => {

    loadSettings();

  }, []);


  async function loadSettings() {

    try {

      const settings =
        await getHeaderSettings();


      const color =
        normalizeHexColor(
          settings.theme_color ||
          DEFAULT_THEME_COLOR
        );


      setThemeColor(color);


      setWebsiteName(
        settings.website_name ||
        "SutoCraft"
      );


      setLogoUrl(
        settings.logo_url ||
        ""
      );

    } catch (error) {

      console.error(
        "Failed to load theme settings:",
        error
      );


      setThemeColor(
        DEFAULT_THEME_COLOR
      );

    } finally {

      setLoading(false);

    }
  }


  /* =====================================================
     APPLY THEME
     ===================================================== */

  useEffect(() => {

    applyThemeVariables(
      themeColor
    );

  }, [themeColor]);


  /* =====================================================
     CONTEXT
     ===================================================== */

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


/* =====================================================
   USE THEME
   ===================================================== */

export function useTheme() {

  return useContext(
    ThemeContext
  );
}