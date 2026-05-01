<template>
  <div
    ref="el"
    :style="{ position: 'relative', width: width, overflow: 'hidden' }"
  >
    <div
      :style="{
        transform: isVisible ? 'translateY(0)' : 'translateY(75px)',
        opacity: isVisible ? 1 : 0,
        transition: 'transform 0.5s ease 0.25s, opacity 0.5s ease 0.25s',
      }"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  width?: string
}>()

const el = ref<HTMLElement | null>(null)
const isVisible = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.1 }
  )
  if (el.value) observer.observe(el.value)
})
</script>
