import tailwindcss from '@tailwindcss/vite'
import { config } from 'dotenv'

// Load .env file
config()

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['./app/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  // Nitro config for Node.js native modules
  nitro: {
    externals: {
      // pdfkit and nodemailer use Node.js built-ins — keep external
      external: ['pdfkit', 'nodemailer'],
    },
  },

  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    // Email / SMTP
    emailTo:    process.env.EMAIL_TO   || 'ioauura@gmail.com',
    emailFrom:  process.env.EMAIL_FROM || 'noreply@auraa.digital',
    smtpHost:   process.env.SMTP_HOST  || 'smtp.gmail.com',
    smtpPort:   process.env.SMTP_PORT  || '587',
    smtpSecure: process.env.SMTP_SECURE || 'false',
    smtpUser:   process.env.SMTP_USER  || '',
    smtpPass:   process.env.SMTP_PASS  || '',
    // Admin
    adminToken: process.env.ADMIN_TOKEN || 'change-me-in-production',
    public: {
      appUrl: process.env.APP_URL || '',
    },
  },

  app: {
    head: {
      title: 'Auraa — Digital Agency',
      // Anti-flash: apply saved theme before page renders
      script: [
        {
          innerHTML: `(function(){try{var t=localStorage.getItem('auraa-theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})()`,
          type: 'text/javascript',
        },
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Aura — технологический партнер нового поколения, создающий премиальные цифровые продукты.',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
        },
      ],
    },
  },
})
