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

export async function generateBriefPdf(brief: BriefRecord): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 60, bottom: 60, left: 60, right: 60 },
      info: {
        Title: `Бриф проекта — ${brief.name}`,
        Author: 'Auraa Digital Agency',
        Subject: 'Бриф проекта',
        CreationDate: new Date(brief.created_at),
      },
      // Используем стандартные шрифты PDF, которые поддерживают Unicode
      font: 'Helvetica',
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

    // Logo text (латиница)
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

    // Title on right (кириллица)
    doc
      .font('Helvetica-Bold')
      .fontSize(13)
      .fillColor(WHITE)
      .text('БРИФ ПРОЕКТА', margin, 50, { align: 'right', width: contentW })

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
      // Section label
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
      if (!value) return
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
        .text(value, margin, y + 14, { width: colW, lineGap: 3 })

      const textH = doc.heightOfString(value, { width: colW }) + 14
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

      if (val1) {
        doc.font('Helvetica').fontSize(8).fillColor(GRAY).text(label1, margin, startY)
        doc.font('Helvetica-Bold').fontSize(10).fillColor(NAVY).text(val1, margin, startY + 14, { width: colW })
      }
      if (val2) {
        doc.font('Helvetica').fontSize(8).fillColor(GRAY).text(label2, margin + colW + 20, startY)
        doc.font('Helvetica-Bold').fontSize(10).fillColor(NAVY).text(val2, margin + colW + 20, startY + 14, { width: colW })
      }

      const h1 = val1 ? doc.heightOfString(val1, { width: colW }) : 0
      const h2 = val2 ? doc.heightOfString(val2, { width: colW }) : 0
      y = startY + Math.max(h1, h2) + 28
    }

    // ── SECTION 1: Contact ─────────────────────────────────────────
    section('Контактная информация')
    fieldRow('Имя клиента', brief.name, 'Email', brief.email)
    fieldRow('Телефон', brief.phone, 'Компания', brief.company || '—')

    // ── SECTION 2: Project ─────────────────────────────────────────
    section('О проекте')
    fieldRow('Тип услуги', brief.project_type, 'Бюджет', brief.budget || 'Не указан')

    if (brief.description) {
      doc.font('Helvetica').fontSize(8).fillColor(GRAY).text('Описание задачи', margin, y)
      y += 14

      // Description box
      const descH = Math.max(60, doc.heightOfString(brief.description, { width: contentW }) + 24)
      doc.roundedRect(margin, y, contentW, descH, 8).fill(LIGHT)
      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor(NAVY)
        .text(brief.description, margin + 16, y + 12, { width: contentW - 32, lineGap: 4 })
      y += descH + 20
    }

    // ── SECTION 3: Meta ────────────────────────────────────────────
    section('Служебная информация')
    fieldRow('ID заявки', `#${String(brief.id).padStart(4, '0')}`, 'Статус', brief.status === 'new' ? 'Новый' : 'Обработан')
    fieldRow('Дата подачи', formatDate(brief.created_at), 'Источник', 'Сайт auraa.digital')

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
        `Документ сгенерирован автоматически ${formatDate(new Date().toISOString())}`,
        margin, footerY + 22,
        { align: 'center', width: contentW },
      )

    doc.end()
  })
}