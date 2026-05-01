<template>
  <section
    class="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden alcantara-texture"
  >
    <UiParallaxAuraa
      extra-class="text-[54vw] md:text-[34vw] -top-[2%] -left-[14%] md:-left-[8%] rotate-[-10deg]"
      :speed="0.9"
    />

    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[120px] rounded-full pointer-events-none"
      style="background-color: var(--accent-subtle)"
    />

    <div class="max-w-7xl mx-auto px-6 text-center z-10 flex flex-col items-center">
      <div
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-bold tracking-[0.2em] uppercase mb-12 mt-12"
        style="border-color: var(--border-light); background-color: var(--accent-subtle); color: var(--text-primary)"
      >
        <span class="w-2 h-2 rounded-full" style="background-color: var(--accent)" />
        Будущее цифрового совершенства
      </div>

      <h1
        class="text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-tighter leading-[0.9] mb-8"
        style="color: var(--text-primary)"
      >
        Раскрываем <br />
        <span class="text-gradient">Ваш Потенциал</span>
      </h1>

      <p
        class="max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed mb-12"
        style="color: var(--text-secondary)"
      >
        Aura — технологический партнер нового поколения, создающий премиальные
        цифровые продукты, которые вдохновляют и обеспечивают значимый рост вашего
        бизнеса.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
        <NuxtLink to="/brief" class="group navy-button flex items-center gap-2">
          Начать проект
          <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </NuxtLink>
        <a href="#cases" class="outline-button">
          Наши работы
        </a>
      </div>
    </div>

    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
      <span
        class="text-[10px] uppercase tracking-[0.2em] font-bold"
        style="color: var(--text-muted)"
      >
        Скролл
      </span>
      <div
        class="w-[1px] h-12"
        style="background: linear-gradient(to bottom, var(--text-primary), transparent)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
</script>
