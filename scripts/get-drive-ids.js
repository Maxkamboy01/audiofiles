// Скрипт для автоматического получения ID файлов из Google Drive
// Этот скрипт поможет автоматизировать процесс получения ID всех файлов

const fs = require("fs")

// Функция для извлечения ID из ссылки Google Drive
function extractFileId(driveUrl) {
  const match = driveUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)
  return match ? match[1] : null
}

// Функция для создания правильной ссылки для скачивания
function createDownloadUrl(fileId) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`
}

// Список ваших файлов (нужно будет заполнить вручную или через API)
const driveFiles = [
  {
    number: 1,
    name: "001_surah_al_fatihah.mp3",
    shareUrl: "https://drive.google.com/file/d/ВАША_ССЫЛКА_1/view?usp=sharing",
  },
  {
    number: 2,
    name: "002_surah_al_baqarah.mp3",
    shareUrl: "https://drive.google.com/file/d/ВАША_ССЫЛКА_2/view?usp=sharing",
  },
  // ... добавьте все остальные файлы
]

// Функция для обновления файла surahsData.ts
function updateSurahsData() {
  let surahsDataContent = fs.readFileSync("./utils/surahsData.ts", "utf8")

  driveFiles.forEach((file) => {
    const fileId = extractFileId(file.shareUrl)
    if (fileId) {
      const placeholder = `ЗАМЕНИТЕ_НА_ID_${String(file.number).padStart(3, "0")}`
      surahsDataContent = surahsDataContent.replace(placeholder, fileId)
      console.log(`✅ Обновлен файл ${file.number}: ${fileId}`)
    }
  })

  fs.writeFileSync("./utils/surahsData.ts", surahsDataContent)
  console.log("🎉 Файл surahsData.ts успешно обновлен!")
}

// Запуск скрипта
console.log("🚀 Начинаем обновление ID файлов...")
updateSurahsData()
