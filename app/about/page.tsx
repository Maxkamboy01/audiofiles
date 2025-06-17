"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/hooks/useLanguage"

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <h1 className="text-4xl font-bold text-emerald-800 dark:text-emerald-300 mb-6 text-center">
              {t("aboutQuran")}
            </h1>

            <div className="space-y-6 text-gray-700 dark:text-gray-300">
              <p className="text-lg leading-relaxed">{t("quranDescription")}</p>

              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-emerald-800 dark:text-emerald-300 mb-4">
                  {t("benefitsOfListening")}
                </h2>
                <ul className="space-y-2">
                  <li>• {t("benefit1")}</li>
                  <li>• {t("benefit2")}</li>
                  <li>• {t("benefit3")}</li>
                  <li>• {t("benefit4")}</li>
                </ul>
              </div>

              <div className="bg-teal-50 dark:bg-teal-900/20 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-teal-800 dark:text-teal-300 mb-4">{t("importantVerse")}</h2>
                <blockquote className="text-xl italic text-center py-4 border-l-4 border-teal-500 pl-4">
                  "وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ"
                </blockquote>
                <p className="text-center mt-2 text-gray-600 dark:text-gray-400">{t("verseTranslation")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
