import PDFDocument from 'pdfkit'
import type { BriefRecord } from '../db/index'

// Brand colors
const NAVY   = '#0F254B'
const ACCENT = '#4a7fd4'
const GRAY   = '#6b7280'
const LIGHT  = '#f8fafc'
const WHITE  = '#ffffff'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// Функция для преобразования кириллицы в латиницу (транслитерация)
function transliterate(text: string): string {
  if (!text) return ''
  
  const translitMap: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
    'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
    'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
    'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
    'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
  }
  
  return text.split('').map(char => translitMap[char] || char).join('')
}

// Альтернатива: использовать только латиницу для ключевых полей
function safeText(text: string): string {
  // Для email, телефонов и чисел оставляем как есть
  if (/^[a-zA-Z0-9@.+_-]+$/.test(text) || /^\+?[0-9\s()-]+$/.test(text)) {
    return text
  }
  
  // Для кириллицы используем транслитерацию
  return transliterate(text)
}

export async function generateBriefPdf(brief: BriefRecord): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 60, bottom: 60, left: 60, right: 60 },
      info: {
        Title: `Brief project — ${safeText(brief.name)}`,
        Author: 'Auraa Digital Agency',
        Subject: 'Project brief',
        CreationDate: new Date(brief.created_at),
      },
    })

    const chunks: Buffer[] = []
    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const pageW = doc.page.width
    const margin = 60
    const contentW = pageW - margin * 2

    // ── Header background ──────────────────────────────────────────
    doc.rect(0, 0, pageW, 140).fill(NAVY)

    // Logo text
    doc
      .font('Helvetica-Bold')
      .fontSize(28)
      .fillColor(WHITE)
      .text('AURAA', margin, 45)

    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor('rgba(255,255,255,0.5)')
      .text('digital agency', margin, 78)

    // Title on right (на английском, чтобы избежать проблем с кириллицей)
    doc
      .font('Helvetica-Bold')
      .fontSize(13)
      .fillColor(WHITE)
      .text('PROJECT BRIEF', margin, 50, { align: 'right', width: contentW })

    doc
      .font('Helvetica')
      .fontSize(9)
      .fillColor('rgba(255,255,255,0.55)')
      .text(`#${String(brief.id).padStart(4, '0')} · ${formatDate(brief.created_at)}`, margin, 72, { align: 'right', width: contentW })

    // ── Accent stripe ──────────────────────────────────────────────
    doc.rect(0, 140, pageW, 4).fill(ACCENT)

    let y = 170

    // ── Section helper ─────────────────────────────────────────────
    function section(title: string) {
      // Section label (на английском)
      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .fillColor(ACCENT)
        .text(title.toUpperCase(), margin, y, { characterSpacing: 1.5 })
      y += 18

      // Underline
      doc.moveTo(margin, y).lineTo(margin + contentW, y).strokeColor('#e2e8f0').lineWidth(1).stroke()
      y += 14
    }

    // ── Field helper ───────────────────────────────────────────────
    function field(label: string, value: string | null | undefined, fullWidth = false) {
      const safeValue = value ? safeText(value) : ''
      if (!safeValue && !value) return
      
      const colW = fullWidth ? contentW : contentW / 2 - 10

      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor(GRAY)
        .text(label, margin, y)

      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .fillColor(NAVY)
        .text(safeValue, margin, y + 14, { width: colW, lineGap: 3 })

      const textH = doc.heightOfString(safeValue, { width: colW }) + 14
      if (fullWidth) {
        y += textH + 20
      }
    }

    // ── Two-column field helper ────────────────────────────────────
    function fieldRow(
      label1: string, val1: string | null | undefined,
      label2: string, val2: string | null | undefined,
    ) {
      const colW = contentW / 2 - 10
      const startY = y
      const safeVal1 = val1 ? safeText(val1) : ''
      const safeVal2 = val2 ? safeText(val2) : ''

      if (safeVal1) {
        doc.font('Helvetica').fontSize(8).fillColor(GRAY).text(label1, margin, startY)
        doc.font('Helvetica-Bold').fontSize(10).fillColor(NAVY).text(safeVal1, margin, startY + 14, { width: colW })
      }
      if (safeVal2) {
        doc.font('Helvetica').fontSize(8).fillColor(GRAY).text(label2, margin + colW + 20, startY)
        doc.font('Helvetica-Bold').fontSize(10).fillColor(NAVY).text(safeVal2, margin + colW + 20, startY + 14, { width: colW })
      }

      const h1 = safeVal1 ? doc.heightOfString(safeVal1, { width: colW }) : 0
      const h2 = safeVal2 ? doc.heightOfString(safeVal2, { width: colW }) : 0
      y = startY + Math.max(h1, h2) + 28
    }

    // ── SECTION 1: Contact ─────────────────────────────────────────
    section('CONTACT INFORMATION')
    fieldRow('Client name', brief.name, 'Email', brief.email)
    fieldRow('Phone', brief.phone, 'Company', brief.company || '—')

    // ── SECTION 2: Project ─────────────────────────────────────────
    section('PROJECT DETAILS')
    fieldRow('Service type', brief.project_type, 'Budget', brief.budget || 'Not specified')

    if (brief.description) {
      const safeDescription = safeText(brief.description)
      if (safeDescription) {
        doc.font('Helvetica').fontSize(8).fillColor(GRAY).text('Project description', margin, y)
        y += 14

        // Description box
        const descH = Math.max(60, doc.heightOfString(safeDescription, { width: contentW }) + 24)
        doc.roundedRect(margin, y, contentW, descH, 8).fill(LIGHT)
        doc
          .font('Helvetica')
          .fontSize(10)
          .fillColor(NAVY)
          .text(safeDescription, margin + 16, y + 12, { width: contentW - 32, lineGap: 4 })
        y += descH + 20
      }
    }

    // ── SECTION 3: Meta ────────────────────────────────────────────
    section('SYSTEM INFORMATION')
    fieldRow('Request ID', `#${String(brief.id).padStart(4, '0')}`, 'Status', brief.status === 'new' ? 'New' : 'Processed')
    fieldRow('Submission date', formatDate(brief.created_at), 'Source', 'Website auraa.digital')

    // ── Footer ─────────────────────────────────────────────────────
    const footerY = doc.page.height - 55
    doc.rect(0, footerY - 10, pageW, 65).fill(NAVY)

    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor('rgba(255,255,255,0.5)')
      .text(
        'Auraa Digital Agency  ·  hello@aura.digital  ·  auraa.digital',
        margin, footerY + 5,
        { align: 'center', width: contentW },
      )

    doc
      .font('Helvetica')
      .fontSize(7)
      .fillColor('rgba(255,255,255,0.3)')
      .text(
        `Document generated automatically ${formatDate(new Date().toISOString())}`,
        margin, footerY + 22,
        { align: 'center', width: contentW },
      )

    doc.end()
  })
}