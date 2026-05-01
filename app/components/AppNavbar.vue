<template>
  <nav
    class="fixed top-0 left-0 w-full z-50 backdrop-blur-lg border-b"
    style="background-color: var(--glass-bg-strong); border-color: var(--border-subtle)"
  >
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <NuxtLink
        to="/"
        class="text-2xl font-display font-bold tracking-tighter"
        style="color: var(--text-primary)"
      >
        AURA<span style="color: var(--text-muted)">.</span>
      </NuxtLink>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-8">
        <a
          v-for="link in navLinks"
          :key="link.name"
          :href="link.href"
          class="text-sm font-medium transition-colors duration-200"
          style="color: var(--text-secondary)"
          @mouseenter="($event.target as HTMLElement).style.color = 'var(--text-primary)'"
          @mouseleave="($event.target as HTMLElement).style.color = 'var(--text-secondary)'"
        >
          {{ link.name }}
        </a>

        <!-- Theme Toggle -->
        <ThemeToggle />

        <NuxtLink
          to="/brief"
          class="navy-button px-5 py-2 rounded-full text-sm"
        >
          Заполнить бриф
        </NuxtLink>
      </div>

      <!-- Mobile: theme toggle + hamburger -->
      <div class="md:hidden flex items-center gap-3">
        <ThemeToggle />
        <button
          class="transition-colors duration-200"
          style="color: var(--text-primary)"
          @click="isOpen = !isOpen"
        >
          <X v-if="isOpen" class="w-5 h-5" />
          <Menu v-else class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition name="mobile-menu">
      <div
        v-if="isOpen"
        class="md:hidden border-b px-6 py-8 flex flex-col gap-6"
        style="background-color: var(--bg-primary); border-color: var(--border-subtle)"
      >
        <a
          v-for="link in navLinks"
          :key="link.name"
          :href="link.href"
          class="text-xl font-display font-medium transition-colors duration-200"
          style="color: var(--text-primary)"
          @click="isOpen = false"
        >
          {{ link.name }}
        </a>
        <NuxtLink
          to="/brief"
          class="navy-button w-full justify-center py-4 rounded-xl font-bold"
          @click="isOpen = false"
        >
          Заполнить бриф
        </NuxtLink>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { Menu, X } from 'lucide-vue-next'

const isOpen = ref(false)

const navLinks = [
  { name: 'О нас', href: '/#about' },
  { name: 'Преимущества', href: '/#features' },
  { name: 'Услуги', href: '/#services' },
  { name: 'Кейсы', href: '/#cases' },
  { name: 'Калькулятор', href: '/#calculator' },
]
</script>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.2s ease, max-height 0.3s ease;
  overflow: hidden;
  max-height: 500px;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
