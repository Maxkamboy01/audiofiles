"use client"

import type React from "react"
import { createContext, useState, useEffect } from "react"
import { translations } from "@/utils/translations"

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState("ru")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("quran-audio-language")
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem("quran-audio-language", lang)
  }

  const t = (key: string): string => {
    return translations[language]?.[key] || translations["ru"][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>{children}</LanguageContext.Provider>
  )
}
