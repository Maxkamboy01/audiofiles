"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"
import { useTheme } from "@/hooks/useTheme"

export default function Header() {
  const { t, language, setLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: t("home"), href: "/" },
    { name: t("aboutQuran"), href: "/about" },
    { name: t("faq"), href: "/faq" },
    { name: t("discussion"), href: "/discussion" },
    { name: t("contact"), href: "/contact" },
  ]

  const languages = [
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "uz", name: "O'zbek", flag: "🇺🇿" },
    { code: "en", name: "English", flag: "🇬🇧" },
  ]

  return (
    <header className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-emerald-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">ق</span>
            </div>
            <span className="text-xl font-bold text-emerald-800 dark:text-emerald-300">Quran Audio</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 ${
                  pathname === item.href ? "text-emerald-600 dark:text-emerald-400" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none bg-transparent border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Toggle */}
            <Button onClick={toggleTheme} variant="ghost" size="sm">
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant="ghost"
              size="sm"
              className="md:hidden"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    pathname === item.href
                      ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
