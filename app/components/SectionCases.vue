<template>
  <section
    id="cases"
    class="section-padding relative overflow-hidden"
    style="background-color: var(--bg-primary)"
  >
    <UiParallaxAuraa
      extra-class="text-[56vw] md:text-[34vw] -bottom-[10%] -left-[18%] md:-left-[10%] rotate-[10deg]"
      :speed="-0.9"
    />
    <div class="max-w-6xl mx-auto px-6 relative z-10">
      <div class="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
        <div class="max-w-xl">
          <span
            class="font-bold text-[10px] tracking-[0.3em] uppercase mb-4 block"
            style="color: var(--text-muted)"
          >
            Портфолио
          </span>
          <h2 style="color: var(--text-primary)">Избранные проекты</h2>
        </div>
        <button class="outline-button hover:scale-105 active:scale-95 transition-transform">
          Все кейсы
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div
          v-for="(project, i) in cases"
          :key="project.title"
          ref="caseEls"
          class="group cursor-pointer relative"
          :style="getCaseStyle(i)"
          @mouseenter="hoveredIndex = i"
          @mouseleave="hoveredIndex = null"
        >
          <div
            class="relative aspect-[16/11] rounded-[2.5rem] overflow-hidden mb-8 border shadow-2xl"
            style="border-color: var(--border-subtle)"
          >
            <img
              :src="project.image"
              :alt="project.title"
              class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              referrerpolicy="no-referrer"
            />

            <!-- Overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-all duration-500 flex flex-col justify-end p-10"
              :class="hoveredIndex === i ? 'opacity-100' : 'opacity-0'"
            >
              <div
                class="transition-all duration-400"
                :style="{
                  opacity: hoveredIndex === i ? 1 : 0,
                  transform: hoveredIndex === i ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: hoveredIndex === i ? '0.1s' : '0s',
                }"
              >
                <div class="flex gap-2 mb-4">
                  <span
                    v-for="tag in project.tags"
                    :key="tag"
                    class="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider border border-white/10"
                  >
                    {{ tag }}
                  </span>
                </div>
                <p class="text-white/80 text-sm font-light leading-relaxed mb-6 max-w-sm">
                  {{ project.description }}
                </p>
                <div class="flex items-center gap-2 text-white font-display font-bold text-sm">
                  Смотреть кейс
                  <ArrowUpRight class="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </div>

            <!-- FAB -->
            <div
              class="absolute top-8 right-8 w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white transition-all duration-500"
              :class="hoveredIndex === i ? 'opacity-100 scale-100' : 'opacity-0 scale-50'"
            >
              <Plus class="w-6 h-6" />
            </div>
          </div>

          <div class="flex justify-between items-end px-4">
            <div>
              <h3
                class="text-2xl font-display font-bold mb-2 transition-colors duration-300"
                :style="{ color: hoveredIndex === i ? 'var(--text-secondary)' : 'var(--text-primary)' }"
              >
                {{ project.title }}
              </h3>
              <p
                class="text-[10px] font-bold uppercase tracking-[0.2em]"
                style="color: var(--text-muted)"
              >
                {{ project.category }}
              </p>
            </div>
            <div
              class="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500"
              :style="{
                borderColor: hoveredIndex === i ? 'var(--accent)' : 'var(--border-light)',
                backgroundColor: hoveredIndex === i ? 'var(--accent)' : 'transparent',
                color: hoveredIndex === i ? '#fff' : 'var(--text-primary)',
              }"
            >
              <ArrowUpRight class="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowUpRight, Plus } from 'lucide-vue-next'

const cases = [
  { title: 'Lumina App',     category: 'Дизайн продукта', description: 'Интуитивно понятный интерфейс для управления умным домом с использованием ИИ.',                    image: 'https://picsum.photos/seed/aura-case-1/1200/800', tags: ['UI/UX', 'Mobile', 'AI'] },
  { title: 'Vortex Platform',category: 'Разработка',      description: 'Высокопроизводительная торговая платформа для криптоактивов с минимальной задержкой.',             image: 'https://picsum.photos/seed/aura-case-2/1200/800', tags: ['Web3', 'React', 'Node.js'] },
  { title: 'Nexus Identity', category: 'Брендинг',        description: 'Полное визуальное переосмысление для глобальной технологической корпорации.',                      image: 'https://picsum.photos/seed/aura-case-3/1200/800', tags: ['Strategy', 'Logo', 'Brandbook'] },
  { title: 'Aura Cloud',     category: 'Инфраструктура',  description: 'Облачное решение для масштабируемых корпоративных приложений.',                                    image: 'https://picsum.photos/seed/aura-case-4/1200/800', tags: ['Cloud', 'DevOps', 'Scalability'] },
]

const hoveredIndex = ref<number | null>(null)
const caseEls = ref<HTMLElement[]>([])
const visibleCases = ref<boolean[]>(cases.map(() => false))

function getCaseStyle(i: number) {
  return {
    opacity: visibleCases.value[i] ? 1 : 0,
    transform: visibleCases.value[i] ? 'translateY(0)' : 'translateY(40px)',
    transition: `opacity 0.8s cubic-bezier(0.21,0.47,0.32,0.98) ${i * 0.1}s, transform 0.8s cubic-bezier(0.21,0.47,0.32,0.98) ${i * 0.1}s`,
  }
}

onMounted(async () => {
  await nextTick()
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const idx = caseEls.value.indexOf(entry.target as HTMLElement)
        if (entry.isIntersecting && idx !== -1) visibleCases.value[idx] = true
      })
    },
    { threshold: 0.1, rootMargin: '-100px' }
  )
  caseEls.value.forEach((el) => el && observer.observe(el))
})
</script>
