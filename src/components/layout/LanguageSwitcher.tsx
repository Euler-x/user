"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Language {
  code: string;
  label: string;
  nativeLabel: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", label: "English", nativeLabel: "English", flag: "🇺🇸" },
  { code: "es", label: "Spanish", nativeLabel: "Español", flag: "🇪🇸" },
  { code: "fr", label: "French", nativeLabel: "Français", flag: "🇫🇷" },
  { code: "de", label: "German", nativeLabel: "Deutsch", flag: "🇩🇪" },
  { code: "pt", label: "Portuguese", nativeLabel: "Português", flag: "🇧🇷" },
  { code: "zh-CN", label: "Chinese", nativeLabel: "中文", flag: "🇨🇳" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "Korean", nativeLabel: "한국어", flag: "🇰🇷" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", flag: "🇸🇦" },
  { code: "ru", label: "Russian", nativeLabel: "Русский", flag: "🇷🇺" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", flag: "🇮🇳" },
  { code: "tr", label: "Turkish", nativeLabel: "Türkçe", flag: "🇹🇷" },
  { code: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt", flag: "🇻🇳" },
  { code: "th", label: "Thai", nativeLabel: "ไทย", flag: "🇹🇭" },
  { code: "id", label: "Indonesian", nativeLabel: "Bahasa", flag: "🇮🇩" },
];

const STORAGE_KEY = "eulerx-language";

function getStoredLanguage(): string {
  if (typeof window === "undefined") return "en";
  return localStorage.getItem(STORAGE_KEY) || "en";
}

/** Trigger Google Translate via the hidden widget */
function triggerTranslation(langCode: string) {
  if (langCode === "en") {
    // Restore original page
    const frame = document.querySelector<HTMLIFrameElement>(".goog-te-banner-frame");
    if (frame) {
      const restoreBtn = frame.contentDocument?.querySelector<HTMLElement>(
        ".goog-te-banner .goog-te-button button"
      );
      restoreBtn?.click();
    }
    // Also try the cookie-based restore
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + window.location.hostname;
    window.location.reload();
    return;
  }

  document.cookie = `googtrans=/en/${langCode}; path=/;`;
  document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${window.location.hostname}`;

  const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (select) {
    select.value = langCode;
    select.dispatchEvent(new Event("change"));
  } else {
    // Widget not ready yet — retry after a brief delay
    setTimeout(() => {
      const retrySelect = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (retrySelect) {
        retrySelect.value = langCode;
        retrySelect.dispatchEvent(new Event("change"));
      }
    }, 1000);
  }
}

/** Load Google Translate script once */
function ensureGoogleTranslateLoaded() {
  if (typeof window === "undefined") return;
  if (document.getElementById("google-translate-script")) return;

  // Create the hidden container for the widget
  const container = document.createElement("div");
  container.id = "google_translate_element";
  container.style.display = "none";
  document.body.appendChild(container);

  // Set the init callback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  w.googleTranslateElementInit = () => {
    new w.google.translate.TranslateElement(
      { pageLanguage: "en", autoDisplay: false },
      "google_translate_element"
    );
  };

  const script = document.createElement("script");
  script.id = "google-translate-script";
  script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.head.appendChild(script);
}

interface LanguageSwitcherProps {
  compact?: boolean;
}

export default function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentLang(getStoredLanguage());
    ensureGoogleTranslateLoaded();
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const selectLanguage = useCallback((lang: Language) => {
    setCurrentLang(lang.code);
    localStorage.setItem(STORAGE_KEY, lang.code);
    setIsOpen(false);
    triggerTranslation(lang.code);
  }, []);

  const activeLang = languages.find((l) => l.code === currentLang) || languages[0];

  if (compact) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[13px] font-medium text-gray-400 hover:text-white hover:bg-white/[0.03] transition-all duration-200"
        >
          <Globe className="h-4 w-4 flex-shrink-0 text-gray-500" />
          <span className="flex-1 text-left">{activeLang.flag} {activeLang.nativeLabel}</span>
          <ChevronDown className={cn("h-3.5 w-3.5 text-gray-500 transition-transform duration-200", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-1 max-h-64 overflow-y-auto rounded-xl bg-dark-100 border border-white/10 shadow-2xl shadow-black/50 z-50 scrollbar-thin">
            <div className="p-1.5">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => selectLanguage(lang)}
                  className={cn(
                    "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[13px] transition-all duration-150",
                    lang.code === currentLang
                      ? "bg-neon/10 text-neon"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                  )}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span className="flex-1 text-left font-medium">{lang.nativeLabel}</span>
                  <span className="text-[11px] text-gray-600">{lang.label}</span>
                  {lang.code === currentLang && <Check className="h-3.5 w-3.5 text-neon flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200",
          "bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.06]",
          isOpen && "border-neon/20 bg-neon/5"
        )}
        title="Change language"
      >
        <Globe className={cn("h-3.5 w-3.5", isOpen ? "text-neon" : "text-gray-400")} />
        <span className="text-xs text-gray-300 hidden sm:inline">{activeLang.flag}</span>
        <ChevronDown className={cn("h-3 w-3 text-gray-500 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 max-h-80 overflow-y-auto rounded-xl bg-dark-100 border border-white/10 shadow-2xl shadow-black/50 z-50 scrollbar-thin">
          {/* Header */}
          <div className="sticky top-0 bg-dark-100/95 backdrop-blur-sm border-b border-white/5 px-4 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Select Language
            </p>
          </div>

          <div className="p-1.5">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => selectLanguage(lang)}
                className={cn(
                  "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[13px] transition-all duration-150",
                  lang.code === currentLang
                    ? "bg-neon/10 text-neon"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <span className="text-base flex-shrink-0">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <span className="font-medium">{lang.nativeLabel}</span>
                  {lang.code !== currentLang && (
                    <span className="text-[11px] text-gray-600 ml-1.5">{lang.label}</span>
                  )}
                </div>
                {lang.code === currentLang && <Check className="h-3.5 w-3.5 text-neon flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
