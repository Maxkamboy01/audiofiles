import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import "./globals.css"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "Quran Audio - Слушайте и скачивайте Коран",
  description:
    "Онлайн плеер для прослушивания и скачивания сур Корана. Качественные аудиозаписи с возможностью поиска и сохранения прогресса.",
  keywords: "Коран, аудио, ислам, суры, прослушивание, скачивание",
  openGraph: {
    title: "Quran Audio",
    description: "Слушайте и скачивайте суры Корана в высоком качестве",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
