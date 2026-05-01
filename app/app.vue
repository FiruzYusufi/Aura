<template>
  <div>
    <!-- Intro Video Overlay -->
    <Transition name="fade-intro">
      <div
        v-if="shouldRenderIntro && isIntroVisible"
        class="fixed inset-0 z-[200] bg-black"
        :class="isIntroClosing ? 'opacity-0' : 'opacity-100'"
        style="transition: opacity 0.9s ease-out"
      >
        <video
          class="w-full h-full object-cover transition-opacity duration-500"
          :class="isIntroReady ? 'opacity-100' : 'opacity-0'"
          autoplay
          muted
          playsinline
          preload="auto"
          @canplay="isIntroReady = true"
          @ended="closeIntro"
          @error="closeIntro"
        >
          <source src="/video/aura_vid.webm" type="video/webm" />
          <source src="/video/aura_vid.mp4" type="video/mp4" />
        </video>
        <div class="absolute inset-0 bg-black/35 pointer-events-none" />
        <div
          v-if="!isIntroReady"
          class="absolute inset-0 pointer-events-none"
          style="background: radial-gradient(circle at top, rgba(255,255,255,0.08), transparent 45%)"
        />
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div class="font-display font-bold uppercase tracking-[-0.04em] text-white text-[24vw] md:text-[16vw] leading-none">
            Auraa
          </div>
          <div class="absolute bottom-12 md:bottom-16 text-white/90 uppercase tracking-[0.35em] text-xs md:text-sm font-semibold">
            digital company
          </div>
        </div>
      </div>
    </Transition>

    <!-- Main Content -->
    <div
      class="transition-opacity duration-[900ms] ease-out"
      :class="isIntroVisible ? 'opacity-0' : 'opacity-100'"
    >
      <div class="relative min-h-screen" style="background-color: var(--bg-primary)">
        <AppNavbar />
        <main>
          <NuxtPage />
        </main>
        <AppFooter />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { init } = useTheme()

const shouldRenderIntro = ref(false)
const isIntroVisible = ref(false)
const isIntroClosing = ref(false)
const isIntroReady = ref(false)

let closeTimeout: ReturnType<typeof setTimeout> | null = null
let fallbackTimeout: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  // Init theme first — prevents flash
  init()

  const connection = (navigator as any).connection
  const isMobile = window.matchMedia('(max-width: 768px)').matches
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const saveDataEnabled = Boolean(connection?.saveData)
  const slowConnection = ['slow-2g', '2g', '3g'].includes(connection?.effectiveType || '')

  if (isMobile || prefersReducedMotion || saveDataEnabled || slowConnection) {
    shouldRenderIntro.value = false
    isIntroVisible.value = false
    return
  }

  shouldRenderIntro.value = true
  isIntroVisible.value = true

  fallbackTimeout = setTimeout(() => {
    isIntroReady.value = true
  }, 1200)
})

onUnmounted(() => {
  if (closeTimeout) clearTimeout(closeTimeout)
  if (fallbackTimeout) clearTimeout(fallbackTimeout)
})

function closeIntro() {
  if (isIntroClosing.value || !isIntroVisible.value) return
  isIntroClosing.value = true
  closeTimeout = setTimeout(() => {
    isIntroVisible.value = false
  }, 900)
}
</script>
