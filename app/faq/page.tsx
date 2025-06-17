"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface FAQItem {
  question: string
  answer: string
}

export default function FAQPage() {
  const { t } = useLanguage()
  const [openItems, setOpenItems] = useState<number[]>([])

  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      author: "Ахмед",
      message: "Ассаляму алейкум! Подскажите, можно ли слушать Коран во время работы?",
      timestamp: "2 часа назад",
      replies: [
        {
          id: 1,
          author: "Фатима",
          message: "Ва алейкум ассалям! Да, можно, это даже поощряется. Коран приносит баракат в любое время.",
          timestamp: "1 час назад",
        },
      ],
    },
    {
      id: 2,
      author: "Марьям",
      message: "Какую суру лучше читать для успокоения души?",
      timestamp: "5 часов назад",
      replies: [],
    },
  ])

  const [discussionForm, setDiscussionForm] = useState({
    author: "",
    email: "",
    message: "",
  })

  const [isSubmittingDiscussion, setIsSubmittingDiscussion] = useState(false)
  const [replyingTo, setReplyingTo] = useState<number | null>(null)

  const faqItems: FAQItem[] = [
    {
      question: t("faq1Question"),
      answer: t("faq1Answer"),
    },
    {
      question: t("faq2Question"),
      answer: t("faq2Answer"),
    },
    {
      question: t("faq3Question"),
      answer: t("faq3Answer"),
    },
    {
      question: t("faq4Question"),
      answer: t("faq4Answer"),
    },
    {
      question: t("faq5Question"),
      answer: t("faq5Answer"),
    },
  ]

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const handleSubmitDiscussion = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingDiscussion(true)

    try {
      const TELEGRAM_BOT_TOKEN = "8119557550:AAGtFP8qkxh0GKO5snVT_Yx9U1wZhYyBr-o"
      const TELEGRAM_CHAT_ID = "1325172996"

      const message = `
🗣️ Новый вопрос в обсуждении:

👤 Автор: ${discussionForm.author}
📧 Email: ${discussionForm.email || "Не указан"}
❓ Вопрос: ${discussionForm.message}

#обсуждение #вопрос
      `

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        }),
      })

      // Добавить вопрос в локальный список
      const newDiscussion = {
        id: Date.now(),
        author: discussionForm.author,
        message: discussionForm.message,
        timestamp: "Только что",
        replies: [],
      }

      setDiscussions((prev) => [newDiscussion, ...prev])
      setDiscussionForm({ author: "", email: "", message: "" })
      alert(t("questionPosted"))
    } catch (error) {
      alert(t("questionError"))
    } finally {
      setIsSubmittingDiscussion(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <h1 className="text-4xl font-bold text-emerald-800 dark:text-emerald-300 mb-8 text-center">
              {t("faqTitle")}
            </h1>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full p-4 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-800 dark:text-gray-200">{item.question}</span>
                    {openItems.includes(index) ? (
                      <ChevronUp className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-emerald-600" />
                    )}
                  </button>

                  {openItems.includes(index) && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Discussion Section */}
        <Card className="mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-emerald-800 dark:text-emerald-300 mb-6 text-center">
              {t("discussionTitle")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-8">{t("discussionDescription")}</p>

            {/* Discussion Messages */}
            <div className="space-y-4 mb-8 max-h-96 overflow-y-auto">
              {discussions.map((discussion) => (
                <div key={discussion.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {discussion.author.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-800 dark:text-gray-200">{discussion.author}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{discussion.timestamp}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-2">{discussion.message}</p>

                      {/* Replies */}
                      {discussion.replies && discussion.replies.length > 0 && (
                        <div className="ml-4 space-y-2 border-l-2 border-emerald-200 dark:border-emerald-700 pl-4">
                          {discussion.replies.map((reply) => (
                            <div key={reply.id} className="bg-white dark:bg-gray-600 rounded p-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-sm text-emerald-600 dark:text-emerald-400">
                                  {reply.author}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{reply.timestamp}</span>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">{reply.message}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      <Button
                        onClick={() => setReplyingTo(discussion.id)}
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-emerald-600 hover:text-emerald-700"
                      >
                        {t("reply")}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* New Discussion Form */}
            <form onSubmit={handleSubmitDiscussion} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  required
                  value={discussionForm.author}
                  onChange={(e) => setDiscussionForm({ ...discussionForm, author: e.target.value })}
                  placeholder={t("yourName")}
                />
                <Input
                  type="email"
                  value={discussionForm.email}
                  onChange={(e) => setDiscussionForm({ ...discussionForm, email: e.target.value })}
                  placeholder={t("emailOptional")}
                />
              </div>

              <Textarea
                required
                rows={3}
                value={discussionForm.message}
                onChange={(e) => setDiscussionForm({ ...discussionForm, message: e.target.value })}
                placeholder={t("askQuestion")}
              />

              <Button
                type="submit"
                disabled={isSubmittingDiscussion}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmittingDiscussion ? t("posting") : t("postQuestion")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
