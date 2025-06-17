"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, MessageCircle, Heart, Reply } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"

interface Discussion {
  id: number
  author: string
  message: string
  timestamp: string
  likes: number
  replies: ReplyType[]
}

interface ReplyType {
  id: number
  author: string
  message: string
  timestamp: string
}

export default function DiscussionPage() {
  const { t } = useLanguage()

  const [discussions, setDiscussions] = useState<Discussion[]>([
    {
      id: 1,
      author: "Ахмед",
      message:
        "Ассаляму алейкум братья и сестры! Подскажите, можно ли слушать Коран во время работы? Не будет ли это неуважением?",
      timestamp: "2 часа назад",
      likes: 5,
      replies: [
        {
          id: 1,
          author: "Фатима",
          message:
            "Ва алейкум ассалям! Конечно можно, это даже поощряется. Коран приносит баракат в любое время и в любом месте.",
          timestamp: "1 час назад",
        },
        {
          id: 2,
          author: "Юсуф",
          message: "Согласен с сестрой Фатимой. Главное - слушать с уважением и вниманием, когда это возможно.",
          timestamp: "30 минут назад",
        },
      ],
    },
    {
      id: 2,
      author: "Марьям",
      message: "Какую суру лучше читать для успокоения души? Переживаю трудный период в жизни...",
      timestamp: "5 часов назад",
      likes: 8,
      replies: [
        {
          id: 1,
          author: "Абдуллах",
          message: "Сестра, рекомендую суру Аль-Фатиха и Аят аль-Курси. Также сура Аш-Шарх очень успокаивает.",
          timestamp: "4 часа назад",
        },
      ],
    },
    {
      id: 3,
      author: "Омар",
      message: "Субхан Аллах! Этот сайт очень помог мне в изучении Корана. Джазакум Аллаху хайран разработчикам!",
      timestamp: "1 день назад",
      likes: 12,
      replies: [],
    },
  ])

  const [newDiscussion, setNewDiscussion] = useState({
    author: "",
    email: "",
    message: "",
  })

  const [replyForms, setReplyForms] = useState<{ [key: number]: { author: string; message: string } }>({})
  const [showReplyForm, setShowReplyForm] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitDiscussion = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const TELEGRAM_BOT_TOKEN = "8119557550:AAGtFP8qkxh0GKO5snVT_Yx9U1wZhYyBr-o"
      const TELEGRAM_CHAT_ID = "1325172996"

      const message = `
🗣️ Новый вопрос в обсуждении:

👤 Автор: ${newDiscussion.author}
📧 Email: ${newDiscussion.email || "Не указан"}
❓ Сообщение: ${newDiscussion.message}

🌐 Раздел: Обсуждение
⏰ Время: ${new Date().toLocaleString("ru-RU")}

#обсуждение #вопрос #коран
      `

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        }),
      })

      // Добавить в локальный список
      const discussion: Discussion = {
        id: Date.now(),
        author: newDiscussion.author,
        message: newDiscussion.message,
        timestamp: "Только что",
        likes: 0,
        replies: [],
      }

      setDiscussions((prev) => [discussion, ...prev])
      setNewDiscussion({ author: "", email: "", message: "" })
      alert(t("questionPosted"))
    } catch (error) {
      alert(t("questionError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitReply = async (discussionId: number) => {
    const replyData = replyForms[discussionId]
    if (!replyData?.author || !replyData?.message) return

    try {
      const TELEGRAM_BOT_TOKEN = "8119557550:AAGtFP8qkxh0GKO5snVT_Yx9U1wZhYyBr-o"
      const TELEGRAM_CHAT_ID = "1325172996"

      const originalDiscussion = discussions.find((d) => d.id === discussionId)
      const message = `
💬 Новый ответ в обсуждении:

👤 Автор ответа: ${replyData.author}
💭 Ответ: ${replyData.message}

📝 Отвечает на сообщение: "${originalDiscussion?.message.substring(0, 100)}..."
👤 Автор оригинального сообщения: ${originalDiscussion?.author}

#ответ #обсуждение
      `

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        }),
      })

      // Добавить ответ в локальный список
      const newReply: ReplyType = {
        id: Date.now(),
        author: replyData.author,
        message: replyData.message,
        timestamp: "Только что",
      }

      setDiscussions((prev) =>
        prev.map((discussion) =>
          discussion.id === discussionId ? { ...discussion, replies: [...discussion.replies, newReply] } : discussion,
        ),
      )

      setReplyForms((prev) => ({ ...prev, [discussionId]: { author: "", message: "" } }))
      setShowReplyForm(null)
      alert("Ответ отправлен!")
    } catch (error) {
      alert("Ошибка при отправке ответа")
    }
  }

  const handleLike = (discussionId: number) => {
    setDiscussions((prev) =>
      prev.map((discussion) =>
        discussion.id === discussionId ? { ...discussion, likes: discussion.likes + 1 } : discussion,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <MessageCircle className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-emerald-800 dark:text-emerald-300 mb-4">{t("discussionTitle")}</h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">{t("discussionDescription")}</p>
            </div>

            {/* New Discussion Form */}
            <Card className="mb-8 bg-emerald-50 dark:bg-emerald-900/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-emerald-800 dark:text-emerald-300 mb-4">
                  Задать новый вопрос
                </h3>
                <form onSubmit={handleSubmitDiscussion} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      required
                      value={newDiscussion.author}
                      onChange={(e) => setNewDiscussion({ ...newDiscussion, author: e.target.value })}
                      placeholder={t("yourName")}
                    />
                    <Input
                      type="email"
                      value={newDiscussion.email}
                      onChange={(e) => setNewDiscussion({ ...newDiscussion, email: e.target.value })}
                      placeholder={t("emailOptional")}
                    />
                  </div>

                  <Textarea
                    required
                    rows={4}
                    value={newDiscussion.message}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, message: e.target.value })}
                    placeholder={t("askQuestion")}
                  />

                  <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? t("posting") : t("postQuestion")}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Discussions List */}
            <div className="space-y-6">
              {discussions.map((discussion) => (
                <Card key={discussion.id} className="bg-white dark:bg-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                        {discussion.author.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{discussion.author}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{discussion.timestamp}</span>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{discussion.message}</p>

                        <div className="flex items-center space-x-4 mb-4">
                          <Button
                            onClick={() => handleLike(discussion.id)}
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-red-500"
                          >
                            <Heart className="h-4 w-4 mr-1" />
                            {discussion.likes}
                          </Button>

                          <Button
                            onClick={() => setShowReplyForm(showReplyForm === discussion.id ? null : discussion.id)}
                            variant="ghost"
                            size="sm"
                            className="text-emerald-600 hover:text-emerald-700"
                          >
                            <Reply className="h-4 w-4 mr-1" />
                            {t("reply")}
                          </Button>
                        </div>

                        {/* Replies */}
                        {discussion.replies.length > 0 && (
                          <div className="ml-6 space-y-3 border-l-2 border-emerald-200 dark:border-emerald-700 pl-4">
                            {discussion.replies.map((reply) => (
                              <div key={reply.id} className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                    {reply.author}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">{reply.timestamp}</span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">{reply.message}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply Form */}
                        {showReplyForm === discussion.id && (
                          <div className="mt-4 ml-6 border-l-2 border-emerald-200 dark:border-emerald-700 pl-4">
                            <div className="space-y-3">
                              <Input
                                placeholder="Ваше имя"
                                value={replyForms[discussion.id]?.author || ""}
                                onChange={(e) =>
                                  setReplyForms((prev) => ({
                                    ...prev,
                                    [discussion.id]: { ...prev[discussion.id], author: e.target.value },
                                  }))
                                }
                              />
                              <Textarea
                                placeholder="Ваш ответ..."
                                rows={3}
                                value={replyForms[discussion.id]?.message || ""}
                                onChange={(e) =>
                                  setReplyForms((prev) => ({
                                    ...prev,
                                    [discussion.id]: { ...prev[discussion.id], message: e.target.value },
                                  }))
                                }
                              />
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => handleSubmitReply(discussion.id)}
                                  size="sm"
                                  className="bg-emerald-600 hover:bg-emerald-700"
                                >
                                  Отправить ответ
                                </Button>
                                <Button onClick={() => setShowReplyForm(null)} variant="outline" size="sm">
                                  Отмена
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
