<template>
  <div
    aria-hidden="true"
    class="auraa-watermark"
    :class="extraClass"
    :style="{ transform: `translateY(${parallaxY}px)` }"
  >
    Auraa
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  extraClass?: string
  speed?: number
}>()

const speed = computed(() => props.speed ?? 1)
const parallaxY = ref(0)
let ticking = false

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    const maxScroll = document.body.scrollHeight - window.innerHeight
    if (maxScroll <= 0) { ticking = false; return }
    const scrollProgress = window.scrollY / maxScroll
    const range = 90 * speed.value
    parallaxY.value = range - scrollProgress * range * 2
    ticking = false
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>
