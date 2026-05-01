type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'auraa-theme'

// Shared state across all components
const theme = ref<Theme>('system')
const isDark = ref(false)

function getSystemDark(): boolean {
  if (import.meta.server) return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(t: Theme) {
  const dark = t === 'dark' || (t === 'system' && getSystemDark())
  isDark.value = dark
  if (import.meta.server) return
  document.documentElement.classList.toggle('dark', dark)
}

export function useTheme() {
  function init() {
    if (import.meta.server) return

    // Read saved preference
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
    theme.value = saved ?? 'system'
    applyTheme(theme.value)

    // Watch system preference changes
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', () => {
      if (theme.value === 'system') applyTheme('system')
    })
  }

  function setTheme(t: Theme) {
    theme.value = t
    localStorage.setItem(STORAGE_KEY, t)
    applyTheme(t)
  }

  function toggle() {
    // Cycle: system → light → dark → system
    if (theme.value === 'system') setTheme(isDark.value ? 'light' : 'dark')
    else if (theme.value === 'light') setTheme('dark')
    else setTheme('system')
  }

  return { theme, isDark, init, setTheme, toggle }
}
