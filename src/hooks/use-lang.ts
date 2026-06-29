import { useSyncExternalStore, useCallback } from "react";

export type Lang = "en" | "ur";

const STORAGE_KEY = "nafaiq-app-lang";
const listeners = new Set<() => void>();
let current: Lang = readStored();

function readStored(): Lang {
  if (typeof window === "undefined") return "en";
  return window.localStorage.getItem(STORAGE_KEY) === "ur" ? "ur" : "en";
}

function setStore(lang: Lang) {
  current = lang;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, lang);
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Translation dictionary. Keys are English source strings. */
const UR: Record<string, string> = {
  // Nav
  Dashboard: "ڈیش بورڈ",
  "PSX Market": "پی ایس ایکس مارکیٹ",
  Portfolio: "پورٹ فولیو",
  Finance: "مالیات",
  "Learn Hub": "لرن ہب",
  Alerts: "الرٹس",
  Markets: "مارکیٹس",
  Settings: "ترتیبات",
  Profile: "پروفائل",
  "Plans / Upgrade": "پلانز / اپ گریڈ",
  Logout: "لاگ آؤٹ",
  "Sign out": "سائن آؤٹ",
  More: "مزید",
  Lesson: "سبق",
  // Header / common
  "Upgrade to Pro": "پرو میں اپ گریڈ کریں",
  "Free plan": "مفت پلان",
  Home: "ہوم",
  Learn: "سیکھیں",
  // Settings page
  "Personalise how NafaIQ looks and feels.": "نفع آئی کیو کی شکل و صورت کو اپنی پسند کے مطابق بنائیں۔",
  Appearance: "ظاہری شکل",
  "Choose the theme for your dashboard. This applies to the app only — the public site stays dark.":
    "اپنے ڈیش بورڈ کے لیے تھیم منتخب کریں۔ یہ صرف ایپ پر لاگو ہوتا ہے — عوامی سائٹ تاریک رہتی ہے۔",
  Dark: "تاریک",
  Light: "روشن",
  "Default OLED-friendly terminal look": "ڈیفالٹ OLED دوست ٹرمینل لُک",
  "Bright, high-contrast daytime view": "روشن، ہائی کنٹراسٹ دن کا منظر",
  Language: "زبان",
  "Choose the language for the app interface.": "ایپ انٹرفیس کے لیے زبان منتخب کریں۔",
  English: "انگریزی",
  Urdu: "اردو",
  "Standard interface language": "معیاری انٹرفیس زبان",
  "Right-to-left Urdu interface": "دائیں سے بائیں اردو انٹرفیس",
  Account: "اکاؤنٹ",
  Name: "نام",
  Email: "ای میل",
  Plan: "پلان",
};

export function translate(lang: Lang, key: string): string {
  if (lang === "en") return key;
  return UR[key] ?? key;
}

/**
 * App language (English / Urdu) shared across components and persisted.
 * Scoped to the authenticated app — the landing page stays English.
 */
export function useLang() {
  const lang = useSyncExternalStore(
    subscribe,
    () => current,
    () => "en" as Lang,
  );

  const setLang = useCallback((l: Lang) => setStore(l), []);
  const t = useCallback((key: string) => translate(lang, key), [lang]);

  return { lang, setLang, t, isUrdu: lang === "ur" };
}
