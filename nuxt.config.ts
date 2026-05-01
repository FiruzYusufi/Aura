import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['./app/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY || '',
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
