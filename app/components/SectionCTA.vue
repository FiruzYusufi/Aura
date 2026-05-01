<template>
  <section
    class="py-24 md:py-32 relative overflow-hidden"
    style="background-color: var(--bg-primary)"
  >
    <UiParallaxAuraa
      extra-class="text-[60vw] md:text-[36vw] -top-[14%] -left-[20%] md:-left-[10%] rotate-[-8deg]"
      :speed="-0.8"
    />
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] blur-[150px] rounded-full pointer-events-none"
      style="background-color: var(--accent-subtle)"
    />

    <div class="max-w-7xl mx-auto px-6 relative z-10">
      <div
        ref="ctaEl"
        class="relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] border backdrop-blur-xl transition-all duration-700"
        :style="[ctaStyle, { borderColor: 'var(--border-light)', backgroundColor: 'var(--glass-bg-strong)', boxShadow: '0 28px 90px var(--shadow-color)' }]"
      >
        <div
          class="absolute inset-0"
          style="background: linear-gradient(135deg, var(--accent-subtle), transparent 40%, var(--accent-subtle))"
        />
        <div
          class="absolute -top-20 right-0 w-72 h-72 rounded-full blur-3xl"
          style="background-color: var(--accent-subtle2)"
        />

        <div class="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] gap-10 lg:gap-14 p-8 md:p-12 lg:p-16 items-center">
          <div>
            <span
              class="inline-flex items-center rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em] mb-6"
              style="border-color: var(--border-light); background-color: var(--glass-bg); color: var(--text-muted)"
            >
              Готовы к трансформации?
            </span>

            <h2
              class="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter leading-[0.92] mb-6"
              style="color: var(--text-primary)"
            >
              Давайте строить<br />
              <span class="text-gradient">вместе</span>
            </h2>

            <p
              class="max-w-2xl text-base md:text-lg font-light leading-relaxed mb-8"
              style="color: var(--text-secondary)"
            >
              Объединим стратегию, дизайн и разработку в один понятный процесс. Мы
              поможем превратить идею в сильный цифровой продукт, который удобно
              развивать и масштабировать.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 sm:items-center">
              <NuxtLink
                to="/brief"
                class="group navy-button inline-flex items-center justify-center gap-3 text-base md:text-lg px-7 py-4"
              >
                Начать проект
                <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </NuxtLink>
              <p
                class="text-sm leading-relaxed max-w-sm"
                style="color: var(--text-muted)"
              >
                Ответим на заявку, уточним задачу и предложим следующий шаг.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <div
              v-for="(benefit, index) in benefits"
              :key="benefit.title"
              ref="benefitEls"
              class="rounded-[1.75rem] border backdrop-blur-sm p-5 md:p-6 transition-all duration-500"
              :style="[getBenefitStyle(index), { borderColor: 'var(--border-subtle)', backgroundColor: 'var(--glass-bg)', boxShadow: '0 16px 45px var(--shadow-color)' }]"
            >
              <div class="flex items-start gap-4">
                <div
                  class="w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-lg shrink-0"
                  style="background-color: var(--accent)"
                >
                  <component :is="benefit.icon" class="w-5 h-5" />
                </div>
                <div>
                  <h3
                    class="text-xl font-display font-bold mb-2"
                    style="color: var(--text-primary)"
                  >
                    {{ benefit.title }}
                  </h3>
                  <p
                    class="text-sm md:text-[15px] leading-relaxed"
                    style="color: var(--text-secondary)"
                  >
                    {{ benefit.text }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight, Rocket, ShieldCheck, Clock3 } from 'lucide-vue-next'

const benefits = [
  { icon: Rocket,      title: 'Быстрый старт',        text: 'Переходим к концепции и первым решениям без долгих пауз.' },
  { icon: ShieldCheck, title: 'Четкий процесс',        text: 'Прозрачные этапы, понятные сроки и контроль качества на каждом шаге.' },
  { icon: Clock3,      title: 'Поддержка после релиза',text: 'Остаемся рядом после запуска и помогаем продукту расти дальше.' },
]

const ctaEl = ref<HTMLElement | null>(null)
const benefitEls = ref<HTMLElement[]>([])
const ctaVisible = ref(false)
const visibleBenefits = ref<boolean[]>(benefits.map(() => false))

const ctaStyle = computed(() => ({
  opacity: ctaVisible.value ? 1 : 0,
  transform: ctaVisible.value ? 'translateY(0)' : 'translateY(24px)',
}))

function getBenefitStyle(i: number) {
  return {
    opacity: visibleBenefits.value[i] ? 1 : 0,
    transform: visibleBenefits.value[i] ? 'translateX(0)' : 'translateX(18px)',
    transitionDelay: `${i * 0.08}s`,
  }
}

onMounted(async () => {
  await nextTick()
  const ctaObs = new IntersectionObserver(
    ([e]) => { if (e.isIntersecting) ctaVisible.value = true },
    { threshold: 0.1, rootMargin: '-120px' }
  )
  if (ctaEl.value) ctaObs.observe(ctaEl.value)

  const benObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const idx = benefitEls.value.indexOf(e.target as HTMLElement)
        if (e.isIntersecting && idx !== -1) visibleBenefits.value[idx] = true
      })
    },
    { threshold: 0.1, rootMargin: '-120px' }
  )
  benefitEls.value.forEach((el) => el && benObs.observe(el))
})
</script>
