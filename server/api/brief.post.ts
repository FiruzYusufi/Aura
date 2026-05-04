import { initDb, insertBrief, updateBriefStatus } from '../db/index'
import { generateBriefPdf } from '../utils/pdf'
import { sendBriefEmail } from '../utils/mailer'
import { getRequestIP, getHeader } from 'h3'

interface BriefBody {
  name: string
  email: string
  phone: string
  company?: string
  projectType: string
  budget?: string
  description?: string
  timeline?: string
}

export default defineEventHandler(async (event) => {
  // Ensure DB schema exists on first call
  await initDb()

  // Parse & validate
  const body = await readBody<BriefBody>(event)

  const errors: string[] = []
  if (!body?.name?.trim())        errors.push('name')
  if (!body?.email?.trim())       errors.push('email')
  if (!body?.phone?.trim())       errors.push('phone')
  if (!body?.projectType?.trim()) errors.push('projectType')

  if (errors.length) {
    throw createError({
      statusCode: 422,
      statusMessage: `Обязательные поля не заполнены: ${errors.join(', ')}`,
    })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    throw createError({ statusCode: 422, statusMessage: 'Неверный формат email' })
  }

  // Save to DB
  const brief = await insertBrief({
    name:         body.name.trim(),
    email:        body.email.trim().toLowerCase(),
    phone:        body.phone.trim(),
    company:      body.company?.trim() || null,
    project_type: body.projectType.trim(),
    budget:       body.budget?.trim() || null,
    description:  body.description?.trim() || null,
    timeline:     body.timeline?.trim() || null,
    ip_address:   getRequestIP(event, { xForwardedFor: true }) || null,
    user_agent:   getHeader(event, 'user-agent') || null,
  })

  console.log(`[Brief] Saved #${brief.id} from ${brief.email}`)

  // Generate PDF + Send email in background (non-blocking)
  setImmediate(async () => {
    try {
      const pdf = await generateBriefPdf(brief)
      await sendBriefEmail(brief, pdf)
      await updateBriefStatus(brief.id, 'sent')
      console.log(`[Brief] Email sent for #${brief.id}`)
    }
    catch (err) {
      console.error(`[Brief] Email failed for #${brief.id}:`, err)
      await updateBriefStatus(brief.id, 'email_failed').catch(() => {})
    }
  })

  return {
    success: true,
    id: brief.id,
    message: 'Бриф успешно отправлен',
  }
})
