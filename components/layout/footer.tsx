"use client"

import Link from "next/link"
import { useLanguage } from "@/hooks/useLanguage"

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-emerald-800 dark:bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("aboutProject")}</h3>
            <p className="text-emerald-200 dark:text-gray-400 text-sm">{t("projectDescription")}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t("quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-emerald-200 hover:text-white text-sm">
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-emerald-200 hover:text-white text-sm">
                  {t("aboutQuran")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-emerald-200 hover:text-white text-sm">
                  {t("faq")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-emerald-200 hover:text-white text-sm">
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t("contact")}</h3>
            <p className="text-emerald-200 dark:text-gray-400 text-sm mb-2">{t("contactInfo")}</p>
            <div className="space-y-1">
              <p className="text-sm">Telegram: @quran_audio_support</p>
              <p className="text-sm">Email: info@quranaudio.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-700 dark:border-gray-800 mt-8 pt-8 text-center">
          <p className="text-emerald-200 dark:text-gray-400 text-sm">© 2024 Quran Audio. {t("allRightsReserved")}</p>
          <p className="text-emerald-300 dark:text-gray-500 text-xs mt-2">{t("audioSource")}: VKorane.info</p>
        </div>
      </div>
    </footer>
  )
}
