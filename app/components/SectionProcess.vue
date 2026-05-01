<template>
  <section
    id="process"
    class="section-padding alcantara-texture overflow-hidden relative"
  >
    <UiParallaxAuraa
      extra-class="text-[50vw] md:text-[28vw] -top-[6%] -right-[18%] md:-right-[8%] rotate-[-12deg]"
      :speed="0.7"
    />
    <div class="max-w-6xl mx-auto px-6 relative z-10">
      <div class="mb-20 text-center">
        <span
          class="font-bold text-[10px] tracking-[0.3em] uppercase mb-4 block"
          style="color: var(--text-muted)"
        >
          Методология
        </span>
        <h2 style="color: var(--text-primary)">Этапы проектирования</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div
          v-for="(stage, i) in stages"
          :key="stage.number"
          ref="stageEls"
          class="relative p-8 glass-card rounded-3xl border shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden hover:-translate-y-2"
          :style="getStageStyle(i)"
          style="border-color: var(--border-subtle)"
        >
          <!-- Background number -->
          <div
            class="absolute -right-4 -top-4 text-8xl font-display font-black pointer-events-none select-none"
            style="color: var(--accent-subtle2)"
          >
            {{ stage.number }}
          </div>

          <div class="relative z-10">
            <div
              class="w-10 h-10 text-white rounded-xl flex items-center justify-center font-display font-bold text-sm mb-6 shadow-lg"
              style="background-color: var(--accent)"
            >
              {{ stage.number }}
            </div>
            <h3
              class="text-lg font-display font-bold mb-4 leading-tight"
              style="color: var(--text-primary)"
            >
              {{ stage.title }}
            </h3>
            <p
              class="text-[13px] leading-relaxed font-light"
              style="color: var(--text-secondary)"
            >
              {{ stage.description }}
            </p>
          </div>

          <!-- Decorative line -->
          <div
            class="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700"
            style="background-color: var(--accent-subtle3)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const stages = [
  { number: '01', title: 'Брифинг и Анализ',   description: 'Погружаемся в ваш бизнес, изучаем конкурентов и определяем ключевые цели проекта.' },
  { number: '02', title: 'Проектирование',      description: 'Создаем архитектуру, прототипы и продумываем пользовательский опыт (UX).' },
  { number: '03', title: 'Дизайн',              description: 'Разрабатываем визуальную концепцию, которая отражает ценности вашего бренда.' },
  { number: '04', title: 'Разработка',          description: 'Превращаем макеты в живой продукт с использованием современного стека технологий.' },
  { number: '05', title: 'Запуск и Поддержка',  description: 'Тестируем, разворачиваем проект и обеспечиваем его стабильную работу после релиза.' },
]

const stageEls = ref<HTMLElement[]>([])
const visibleStages = ref<boolean[]>(stages.map(() => false))

function getStageStyle(i: number) {
  return {
    opacity: visibleStages.value[i] ? 1 : 0,
    transform: visibleStages.value[i] ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
    transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
  }
}

onMounted(async () => {
  await nextTick()
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const idx = stageEls.value.indexOf(entry.target as HTMLElement)
        if (entry.isIntersecting && idx !== -1) visibleStages.value[idx] = true
      })
    },
    { threshold: 0.1 }
  )
  stageEls.value.forEach((el) => el && observer.observe(el))
})
</script>
