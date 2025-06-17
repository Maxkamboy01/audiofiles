// Альтернативный способ через Google Drive API
// Для использования этого скрипта нужен API ключ Google Drive

const FOLDER_ID = "1VzFAe9RXe3R9gqzlTCKBgHxSN2VGa_vS" // ID вашей папки
const API_KEY = "ВАШ_API_КЛЮЧ_GOOGLE_DRIVE" // Получите на console.developers.google.com

async function getAllFilesFromFolder() {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents&key=${API_KEY}&fields=files(id,name,webViewLink)`,
    )

    const data = await response.json()

    if (data.files) {
      console.log("📁 Найденные файлы:")

      const filesList = data.files
        .filter((file) => file.name.endsWith(".mp3"))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((file) => {
          const surahNumber = file.name.match(/^(\d{3})/)?.[1]
          return {
            number: Number.parseInt(surahNumber),
            name: file.name,
            id: file.id,
            downloadUrl: `https://drive.google.com/uc?export=download&id=${file.id}`,
          }
        })

      console.table(filesList)

      // Создать код для замены в surahsData.ts
      console.log("\n📝 Код для замены в surahsData.ts:")
      filesList.forEach((file) => {
        console.log(`// Сура ${file.number}: ${file.name}`)
        console.log(`url: "https://drive.google.com/uc?export=download&id=${file.id}",`)
      })

      return filesList
    }
  } catch (error) {
    console.error("❌ Ошибка при получении файлов:", error)
  }
}

// Запуск
getAllFilesFromFolder()
