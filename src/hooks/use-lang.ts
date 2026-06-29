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

  // ---- Shared stat / metric labels ----
  "Portfolio Value": "پورٹ فولیو ویلیو",
  "Total Invested": "کل سرمایہ کاری",
  "Total Gain": "کل منافع",
  "Today's P/L": "آج کا نفع/نقصان",
  "Today's PSX P/L": "آج کا پی ایس ایکس نفع/نقصان",
  "Monthly Spending": "ماہانہ اخراجات",
  "Total Net Worth": "کل مجموعی مالیت",
  "Monthly Income": "ماہانہ آمدنی",
  "Total Expenses": "کل اخراجات",
  "Net Savings": "خالص بچت",
  "Savings Rate": "بچت کی شرح",

  // ---- Dashboard ----
  "Explore PSX": "پی ایس ایکس دیکھیں",
  "Add Transaction": "ٹرانزیکشن شامل کریں",
  "AI Recommendation": "اے آئی تجویز",
  View: "دیکھیں",
  Dismiss: "نظر انداز کریں",
  "Spending Breakdown": "اخراجات کی تفصیل",
  Watchlist: "واچ لسٹ",
  "Savings Goals": "بچت کے اہداف",
  "PKR total": "کل روپے",

  // ---- Portfolio ----
  "Performance vs KSE-100": "کارکردگی بمقابلہ کے ایس ای-100",
  "Outperforming benchmark by +3.2%": "بینچ مارک سے +3.2% بہتر کارکردگی",
  "Haqeeqi Daulat™ — Your REAL Returns": "حقیقی دولت™ — آپ کا اصل منافع",
  "After 16.2% PKR devaluation": "16.2% روپے کی قدر میں کمی کے بعد",
  "Nominal PKR Gain": "برائے نام روپے منافع",
  "PKR Devaluation": "روپے کی قدر میں کمی",
  "Real USD Return": "اصل ڈالر منافع",
  "Devaluation Shield Score": "قدر کمی شیلڈ اسکور",
  "Moderate risk": "درمیانہ خطرہ",
  "Improve Score": "اسکور بہتر بنائیں",
  "Allocation by Sector": "شعبے کے لحاظ سے تقسیم",
  "Allocation by Stock": "اسٹاک کے لحاظ سے تقسیم",
  Holdings: "ملکیتی اسٹاکس",
  Stock: "اسٹاک",
  Sector: "شعبہ",
  Shares: "حصص",
  "Avg Cost": "اوسط لاگت",
  Current: "موجودہ",
  "Mkt Value": "مارکیٹ ویلیو",
  "Gain/Loss": "نفع/نقصان",
  Signal: "سگنل",
  Action: "ایکشن",
  "Add Holding": "ہولڈنگ شامل کریں",
  "AI Portfolio Report": "اے آئی پورٹ فولیو رپورٹ",
  "Get a plain-English analysis — diversification score, risk assessment, top opportunities, and suggested rebalancing.":
    "سادہ زبان میں تجزیہ حاصل کریں — تنوع اسکور، خطرے کا جائزہ، بہترین مواقع اور تجویز کردہ ری بیلنسنگ۔",
  "Generate Report": "رپورٹ بنائیں",
  "Analyzing…": "تجزیہ ہو رہا ہے…",
  "Health Score": "ہیلتھ اسکور",
  "Export as PDF": "پی ڈی ایف ایکسپورٹ کریں",
  Close: "بند کریں",

  // ---- PSX ----
  "Stock Screener": "اسٹاک اسکرینر",
  Price: "قیمت",
  Change: "تبدیلی",
  Volume: "حجم",
  "Mkt Cap": "مارکیٹ کیپ",
  "Sector Heatmap": "سیکٹر ہیٹ میپ",

  // ---- Finance ----
  "Saved this month": "اس ماہ بچایا",
  "Net Savings Rate": "خالص بچت کی شرح",

  // ---- Alerts ----
  "Active Alerts": "فعال الرٹس",
  "Add New Alert": "نیا الرٹ شامل کریں",
  Above: "اوپر",
  Below: "نیچے",
  "Notification History": "اطلاعات کی تاریخ",
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
