"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, SkipBack, SkipForward, Download, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/hooks/useLanguage"
import { surahs, type Surah } from "@/utils/surahsData"

export default function HomePage() {
  const { t, language } = useLanguage()
  const [currentSurah, setCurrentSurah] = useState<Surah>(surahs[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Функция для получения названия суры в зависимости от языка
  const getSurahTitle = (surah: Surah) => {
    switch (language) {
      case "en":
        return surah.englishTitle
      case "uz":
        return surah.uzbekTitle
      default:
        return surah.title
    }
  }

  const filteredSurahs = surahs.filter(
    (surah) =>
      getSurahTitle(surah).toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.number.toString().includes(searchTerm) ||
      surah.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.arabic.includes(searchTerm),
  )

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    const handleError = () => {
      setIsLoading(false)
      console.error("Ошибка загрузки аудио")
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("loadstart", handleLoadStart)
    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("error", handleError)
    audio.addEventListener("ended", () => {
      setIsPlaying(false)
      playNext()
    })

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("loadstart", handleLoadStart)
      audio.removeEventListener("canplay", handleCanPlay)
      audio.removeEventListener("error", handleError)
    }
  }, [currentSurah])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (isPlaying) {
        audio.pause()
      } else {
        await audio.play()
      }
      setIsPlaying(!isPlaying)
    } catch (error) {
      console.error("Ошибка воспроизведения:", error)
    }
  }

  const playNext = () => {
    const currentIndex = surahs.findIndex((s) => s.number === currentSurah.number)
    const nextIndex = (currentIndex + 1) % surahs.length
    setCurrentSurah(surahs[nextIndex])
    setIsPlaying(false)
  }

  const playPrevious = () => {
    const currentIndex = surahs.findIndex((s) => s.number === currentSurah.number)
    const prevIndex = currentIndex === 0 ? surahs.length - 1 : currentIndex - 1
    setCurrentSurah(surahs[prevIndex])
    setIsPlaying(false)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !duration) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const percentage = (clickX / width) * 100

    audio.currentTime = (percentage / 100) * duration
    setCurrentTime(audio.currentTime)
  }

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const downloadSurah = (surah: Surah) => {
    const link = document.createElement("a")
    link.href = surah.url
    link.download = `${String(surah.number).padStart(3, "0")}_${surah.transliteration}.mp3`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Audio Player Section */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-200 dark:border-gray-700">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-300 mb-2">
                {getSurahTitle(currentSurah)}
              </h1>
              <p className="text-2xl text-gray-600 dark:text-gray-300 mb-1 arabic-text">{currentSurah.arabic}</p>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                {t("surahNumber")} {currentSurah.number} • {currentSurah.transliteration} • {currentSurah.verses} аятов
              </p>
              {isLoading && <p className="text-sm text-emerald-600 mt-2">Загрузка...</p>}
            </div>

            <audio ref={audioRef} src={currentSurah.url} preload="metadata" />

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 cursor-pointer" onClick={handleSeek}>
                <div
                  className="bg-emerald-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Button onClick={playPrevious} variant="outline" size="icon" disabled={isLoading}>
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                onClick={togglePlay}
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 w-16 h-16"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8" />
                )}
              </Button>

              <Button onClick={playNext} variant="outline" size="icon" disabled={isLoading}>
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Download Button */}
            <div className="flex justify-center">
              <Button onClick={() => downloadSurah(currentSurah)} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                {t("downloadCurrent")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Section */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Surahs List */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-emerald-800 dark:text-emerald-300">{t("surahsList")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSurahs.map((surah) => (
                <div
                  key={surah.number}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    currentSurah.number === surah.number
                      ? "bg-emerald-100 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700"
                      : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  }`}
                  onClick={() => {
                    setCurrentSurah(surah)
                    setIsPlaying(false)
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{surah.number}</span>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        downloadSurah(surah)
                      }}
                      variant="ghost"
                      size="sm"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{getSurahTitle(surah)}</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-1 arabic-text">{surah.arabic}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {surah.transliteration} • {surah.verses} аятов
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
