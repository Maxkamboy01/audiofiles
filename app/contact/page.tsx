"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, MessageCircle, Mail } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"

export default function ContactPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Здесь интеграция с Telegram Bot
      const TELEGRAM_BOT_TOKEN = "8119557550:AAGtFP8qkxh0GKO5snVT_Yx9U1wZhYyBr-o"
      const TELEGRAM_CHAT_ID = "1325172996"

      const message = `
🔔 Новое сообщение с сайта Quran Audio:

👤 Имя: ${formData.name}
📧 Email: ${formData.email}
💬 Сообщение: ${formData.message}
      `

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        }),
      })

      alert(t("messageSent"))
      setFormData({ name: "", email: "", message: "" })
    } catch (error) {
      alert(t("messageError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <h1 className="text-4xl font-bold text-emerald-800 dark:text-emerald-300 mb-8 text-center">
              {t("contactUs")}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("name")}
                    </label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t("namePlaceholder")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("email")}
                    </label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t("emailPlaceholder")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("message")}
                    </label>
                    <Textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t("messagePlaceholder")}
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? t("sending") : t("sendMessage")}
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-emerald-800 dark:text-emerald-300 mb-4">
                    {t("getInTouch")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{t("contactDescription")}</p>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="h-5 w-5 text-emerald-600" />
                      <span>Telegram: @quran_audio_support</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-emerald-600" />
                      <span>Email: info@quranaudio.com</span>
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50 dark:bg-teal-900/20 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-teal-800 dark:text-teal-300 mb-4">
                    {t("botConfiguration")}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t("botConfigDescription")}</p>
                  <code className="block mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                    TELEGRAM_CHAT_ID: 1325172996
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
