<template>
  <button
    class="theme-toggle group relative"
    :title="label"
    :aria-label="label"
    @click="toggle"
  >
    <!-- Sun icon (light mode) -->
    <Transition name="icon-swap">
      <Sun
        v-if="!isDark"
        key="sun"
        class="w-4 h-4 absolute inset-0 m-auto"
        style="color: var(--text-primary)"
      />
    </Transition>

    <!-- Moon icon (dark mode) -->
    <Transition name="icon-swap">
      <Moon
        v-if="isDark"
        key="moon"
        class="w-4 h-4 absolute inset-0 m-auto"
        style="color: var(--text-primary)"
      />
    </Transition>

    <!-- Tooltip -->
    <span
      class="absolute -bottom-9 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200"
      style="background-color: var(--bg-tertiary); color: var(--text-muted); border: 1px solid var(--border-subtle)"
    >
      {{ label }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'

const { isDark, theme, toggle } = useTheme()

const label = computed(() => {
  if (theme.value === 'system') return isDark.value ? 'Тёмная (авто)' : 'Светлая (авто)'
  return isDark.value ? 'Тёмная' : 'Светлая'
})
</script>

<style scoped>
.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: opacity 0.2s ease, transform 0.25s ease;
}
.icon-swap-enter-from {
  opacity: 0;
  transform: rotate(-30deg) scale(0.7);
}
.icon-swap-leave-to {
  opacity: 0;
  transform: rotate(30deg) scale(0.7);
}
</style>
