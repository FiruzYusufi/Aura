import nodemailer from 'nodemailer'
import type { BriefRecord } from '../db/index'

function getTransporter(config: any) {
  if (!config.smtpUser || !config.smtpPass) {
    console.error('❌ SMTP Configuration Error:')
    console.error('   SMTP_USER:', config.smtpUser ? '✓ Set' : '✗ Missing')
    console.error('   SMTP_PASS:', config.smtpPass ? '✓ Set' : '✗ Missing')
    console.error('')
    console.error('Make sure .env file exists in project root with:')
    console.error('   SMTP_USER="your-email@gmail.com"')
    console.error('   SMTP_PASS="your-app-password"')
    throw new Error('SMTP_USER and SMTP_PASS environment variables are required')
  }

  // Use configured SMTP or fallback to Gmail
  return nodemailer.createTransport({
    host:   config.smtpHost   || 'smtp.gmail.com',
    port:   Number(config.smtpPort) || 587,
    secure: config.smtpSecure === 'true',
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  })
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// Функция для транслитерации кириллицы
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

function safeText(text: string): string {
  // Для email, телефонов и чисел оставляем как есть
  if (/^[a-zA-Z0-9@.+_-]+$/.test(text) || /^\+?[0-9\s()-]+$/.test(text)) {
    return text
  }
  
  // Для кириллицы используем транслитерацию
  return transliterate(text)
}

export async function sendBriefEmail(brief: BriefRecord, pdfBuffer: Buffer): Promise<void> {
  const config = useRuntimeConfig()
  const to = config.emailTo || 'ioauura@gmail.com'
  const from = config.emailFrom || 'noreply@auraa.digital'

  const transporter = getTransporter(config)

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Brief</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,37,75,0.1);">

          <!-- Header -->
          <tr>
            <td style="background:#0F254B;padding:36px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">AURAA</div>
                    <div style="font-size:11px;color:rgba(255,255,255,0.45);margin-top:4px;letter-spacing:2px;">DIGITAL AGENCY</div>
                  </td>
                  <td align="right">
                    <div style="background:rgba(255,255,255,0.1);border-radius:8px;padding:8px 16px;display:inline-block;">
                      <div style="font-size:10px;color:rgba(255,255,255,0.6);letter-spacing:1px;">NEW BRIEF</div>
                      <div style="font-size:18px;font-weight:700;color:#ffffff;margin-top:2px;">#${String(brief.id).padStart(4, '0')}</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Accent stripe -->
          <tr><td style="background:#4a7fd4;height:3px;"></td></tr>

          <!-- Alert banner -->
          <tr>
            <td style="padding:24px 40px 0;">
              <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:16px 20px;display:flex;align-items:center;">
                <span style="font-size:20px;margin-right:12px;">📋</span>
                <div>
                  <div style="font-size:13px;font-weight:700;color:#1e40af;">New project brief received</div>
                  <div style="font-size:12px;color:#3b82f6;margin-top:2px;">${formatDate(brief.created_at)}</div>
                </div>
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px 40px;">

              <!-- Section: Contact -->
              <div style="font-size:10px;font-weight:700;color:#4a7fd4;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px;">CONTACT INFORMATION</div>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td width="50%" style="padding-bottom:16px;vertical-align:top;">
                    <div style="font-size:10px;color:#9ca3af;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px;">Name</div>
                    <div style="font-size:15px;font-weight:600;color:#0F254B;">${brief.name}</div>
                  </td>
                  <td width="50%" style="padding-bottom:16px;vertical-align:top;">
                    <div style="font-size:10px;color:#9ca3af;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px;">Email</div>
                    <div style="font-size:15px;font-weight:600;color:#0F254B;">
                      <a href="mailto:${brief.email}" style="color:#4a7fd4;text-decoration:none;">${brief.email}</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="vertical-align:top;">
                    <div style="font-size:10px;color:#9ca3af;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px;">Phone</div>
                    <div style="font-size:15px;font-weight:600;color:#0F254B;">
                      <a href="tel:${brief.phone}" style="color:#4a7fd4;text-decoration:none;">${brief.phone}</a>
                    </div>
                  </td>
                  <td width="50%" style="vertical-align:top;">
                    <div style="font-size:10px;color:#9ca3af;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px;">Company</div>
                    <div style="font-size:15px;font-weight:600;color:#0F254B;">${brief.company || '—'}</div>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="height:1px;background:#f1f5f9;margin-bottom:28px;"></div>

              <!-- Section: Project -->
              <div style="font-size:10px;font-weight:700;color:#4a7fd4;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px;">PROJECT DETAILS</div>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td width="50%" style="padding-bottom:16px;vertical-align:top;">
                    <div style="font-size:10px;color:#9ca3af;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px;">Service type</div>
                    <div style="display:inline-block;background:#eff6ff;color:#1e40af;font-size:13px;font-weight:600;padding:6px 14px;border-radius:20px;">${brief.project_type}</div>
                  </td>
                  <td width="50%" style="padding-bottom:16px;vertical-align:top;">
                    <div style="font-size:10px;color:#9ca3af;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px;">Budget</div>
                    <div style="font-size:15px;font-weight:600;color:#0F254B;">${brief.budget || 'Not specified'}</div>
                  </td>
                </tr>
              </table>

              ${brief.description ? `
              <div style="background:#f8fafc;border-left:3px solid #4a7fd4;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:28px;">
                <div style="font-size:10px;color:#9ca3af;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">Project description</div>
                <div style="font-size:14px;color:#374151;line-height:1.6;">${brief.description.replace(/\n/g, '<br>')}</div>
              </div>
              ` : ''}

              <!-- CTA -->
              <div style="text-align:center;margin-top:8px;">
                <a href="mailto:${brief.email}?subject=Re: Your project brief — Auraa"
                   style="display:inline-block;background:#0F254B;color:#ffffff;font-size:13px;font-weight:600;padding:14px 32px;border-radius:10px;text-decoration:none;letter-spacing:0.3px;">
                  Reply to client
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0F254B;padding:24px 40px;text-align:center;">
              <div style="font-size:11px;color:rgba(255,255,255,0.4);">
                Auraa Digital Agency · hello@aura.digital · auraa.digital
              </div>
              <div style="font-size:10px;color:rgba(255,255,255,0.25);margin-top:6px;">
                PDF version of the brief is attached to this email
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  transporter.sendMail({
    from: `"Auraa Digital" <${from}>`,
    to,
    subject: `📋 New brief #${String(brief.id).padStart(4, '0')} — ${safeText(brief.name)} (${safeText(brief.project_type)})`,
    html,
    attachments: [
      {
        filename: `brief-${String(brief.id).padStart(4, '0')}-${safeText(brief.name).replace(/\s+/g, '-').toLowerCase()}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  })

  console.log(`[Mailer] Brief #${brief.id} sent to ${to}`)
}