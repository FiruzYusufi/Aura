import { GoogleGenAI } from '@google/genai'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { serviceName, optionNames } = body

  const config = useRuntimeConfig()
  const apiKey = config.geminiApiKey

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return { suggestion: 'ИИ недоступен: добавьте GEMINI_API_KEY в переменные окружения.' }
  }

  try {
    const ai = new GoogleGenAI({ apiKey })
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Как эксперт по цифровым продуктам, предложи 2 коротких совета по улучшению проекта, если выбрана основная услуга "${serviceName}" и доп. опции: ${(optionNames as string[]).join(', ') || 'нет'}. Ответь на русском языке, кратко и профессионально.`,
    })
    return { suggestion: response.text || 'Не удалось получить рекомендации.' }
  } catch (error) {
    console.error('Gemini API error:', error)
    return { suggestion: 'Ошибка при получении рекомендаций.' }
  }
})
