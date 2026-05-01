<template>
  <footer
    class="py-20 border-t"
    style="background-color: var(--bg-primary); border-color: var(--border-subtle)"
  >
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
        <div class="md:col-span-2">
          <div
            class="text-3xl font-display font-bold tracking-tighter mb-8"
            style="color: var(--text-primary)"
          >
            AURA<span style="color: var(--text-muted)">.</span>
          </div>
          <p
            class="max-w-sm text-lg leading-relaxed mb-8"
            style="color: var(--text-muted)"
          >
            Создание премиальных цифровых продуктов, которые вдохновляют и обеспечивают значимый рост для передовых брендов.
          </p>
          <div class="flex gap-6">
            <a
              v-for="icon in socialIcons"
              :key="icon.name"
              href="#"
              class="transition-colors duration-200"
              style="color: var(--text-muted)"
              @mouseenter="($event.target as HTMLElement).style.color = 'var(--text-primary)'"
              @mouseleave="($event.target as HTMLElement).style.color = 'var(--text-muted)'"
            >
              <component :is="icon.component" />
            </a>
          </div>
        </div>

        <div>
          <h4
            class="text-sm font-bold uppercase tracking-widest mb-8"
            style="color: var(--text-primary)"
          >
            Навигация
          </h4>
          <ul class="flex flex-col gap-4" style="color: var(--text-muted)">
            <li v-for="link in navLinks" :key="link.label">
              <a
                :href="link.href"
                class="transition-colors duration-200 hover:underline"
                style="color: var(--text-muted)"
                @mouseenter="($event.target as HTMLElement).style.color = 'var(--text-primary)'"
                @mouseleave="($event.target as HTMLElement).style.color = 'var(--text-muted)'"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4
            class="text-sm font-bold uppercase tracking-widest mb-8"
            style="color: var(--text-primary)"
          >
            Контакты
          </h4>
          <ul class="flex flex-col gap-4" style="color: var(--text-muted)">
            <li>hello@aura.digital</li>
            <li>+7 (999) 000-0000</li>
            <li>ул. Инноваций, 123<br />Москва, Россия</li>
          </ul>
        </div>
      </div>

      <div
        class="pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-medium"
        style="border-color: var(--border-subtle); color: var(--text-muted)"
      >
        <p>© 2026 Aura Digital Agency. Все права защищены.</p>
        <div class="flex gap-8">
          <a href="#" class="transition-colors duration-200 hover:underline" style="color: var(--text-muted)">Политика конфиденциальности</a>
          <a href="#" class="transition-colors duration-200 hover:underline" style="color: var(--text-muted)">Условия использования</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Instagram, Twitter, Linkedin, Github } from 'lucide-vue-next'

const socialIcons = [
  { name: 'instagram', component: Instagram },
  { name: 'twitter', component: Twitter },
  { name: 'linkedin', component: Linkedin },
  { name: 'github', component: Github },
]

const navLinks = [
  { label: 'О нас', href: '#about' },
  { label: 'Преимущества', href: '#features' },
  { label: 'Услуги', href: '#services' },
  { label: 'Кейсы', href: '#cases' },
]
</script>
