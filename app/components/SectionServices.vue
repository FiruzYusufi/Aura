<template>
  <section
    id="services"
    class="py-32 relative overflow-hidden"
    style="background-color: var(--bg-primary)"
  >
    <UiParallaxAuraa
      extra-class="text-[50vw] md:text-[30vw] -top-[8%] -left-[18%] md:-left-[10%] rotate-[6deg]"
      :speed="0.75"
    />
    <div
      class="absolute inset-x-0 top-35 h-[32rem] pointer-events-none"
      style="background: radial-gradient(circle at top, var(--accent-subtle), transparent 60%)"
    />

    <div class="max-w-7xl mx-auto px-6 top-10 relative z-10">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-20">
        <div class="max-w-3xl">
          <span
            class="font-bold text-[10px] tracking-[0.3em] uppercase mb-5 block"
            style="color: var(--text-muted)"
          >
            Наши услуги
          </span>
          <h2
            class="text-5xl md:text-7xl font-display font-bold tracking-tighter leading-[0.92]"
            style="color: var(--text-primary)"
          >
            Собираем сильные<br />
            <span style="color: var(--text-muted)">цифровые продукты</span>
          </h2>
        </div>
        <div class="max-w-md">
          <p
            class="text-base md:text-lg font-light leading-relaxed"
            style="color: var(--text-secondary)"
          >
            Закрываем весь цикл: от идеи и визуальной системы до запуска, продвижения и технической поддержки.
          </p>
        </div>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        <article
          v-for="(service, index) in services"
          :key="service.title"
          ref="serviceEls"
          class="group relative overflow-hidden rounded-[2rem] border backdrop-blur-xl p-8 md:p-10 transition-all duration-500 min-h-[320px]"
          :style="[getServiceStyle(index), {
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--glass-bg)',
            boxShadow: '0 20px 60px var(--shadow-color)',
          }]"
        >
          <div
            class="absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity duration-500"
            style="background: linear-gradient(180deg, var(--accent-subtle), transparent 45%, var(--accent-subtle))"
          />
          <div
            class="absolute -right-10 -top-10 w-36 h-36 rounded-full blur-3xl group-hover:opacity-100 opacity-60 transition-opacity duration-500"
            style="background-color: var(--accent-subtle2)"
          />

          <div class="relative z-10 h-full flex flex-col">
            <div class="flex items-start justify-between gap-4 mb-10">
              <div
                class="w-14 h-14 rounded-2xl text-white flex items-center justify-center shadow-lg"
                style="background-color: var(--accent)"
              >
                <component :is="service.icon" class="w-6 h-6" />
              </div>
              <div
                class="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300"
                style="border-color: var(--border-light); color: var(--text-muted)"
              >
                <ArrowUpRight class="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300" />
              </div>
            </div>

            <div class="mb-6">
              <h3
                class="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4"
                style="color: var(--text-primary)"
              >
                {{ service.title }}
              </h3>
              <p
                class="text-sm md:text-base leading-relaxed max-w-xl"
                style="color: var(--text-secondary)"
              >
                {{ service.description }}
              </p>
            </div>

            <div class="mt-auto flex flex-wrap gap-2">
              <span
                v-for="tag in service.tags"
                :key="tag"
                class="px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-[0.22em]"
                style="border-color: var(--border-light); color: var(--text-muted); background-color: var(--glass-bg)"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </article>
      </div>

      <!-- FAQ -->
      <div class="mt-24 grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-8 lg:gap-10 items-start">
        <!-- FAQ Header card (dark) -->
        <div
          ref="faqHeaderEl"
          class="rounded-[2rem] border p-8 md:p-10 transition-all duration-700"
          :style="[faqHeaderStyle, {
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--accent)',
            boxShadow: '0 24px 70px var(--shadow-strong)',
          }]"
        >
          <span class="text-white/45 font-bold text-[10px] tracking-[0.3em] uppercase mb-5 block">FAQ</span>
          <h3 class="text-4xl md:text-6xl font-display font-bold tracking-tighter leading-[0.95] text-white">
            Часто задаваемые вопросы
          </h3>
          <p class="mt-6 max-w-xl text-sm md:text-base text-white/72 leading-relaxed">
            Собрали ключевые вопросы, которые чаще всего обсуждаем перед стартом.
          </p>
        </div>

        <!-- FAQ Items -->
        <div class="space-y-4">
          <div
            v-for="(item, index) in faqItems"
            :key="item.question"
            ref="faqEls"
            class="overflow-hidden rounded-[1.75rem] border backdrop-blur-xl transition-all duration-500"
            :style="[getFaqStyle(index), {
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--glass-bg-strong)',
              boxShadow: '0 16px 45px var(--shadow-color)',
            }]"
          >
            <button
              type="button"
              class="w-full flex items-center justify-between gap-4 text-left px-6 md:px-7 py-5 md:py-6"
              @click="openFaqIndex = openFaqIndex === index ? -1 : index"
            >
              <p
                class="text-lg md:text-xl font-display font-bold leading-tight"
                style="color: var(--text-primary)"
              >
                {{ item.question }}
              </p>
              <span
                class="shrink-0 flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300"
                :style="openFaqIndex === index
                  ? { borderColor: 'var(--accent)', backgroundColor: 'var(--accent)', color: '#fff' }
                  : { borderColor: 'var(--border-light)', color: 'var(--text-muted)' }"
              >
                <ChevronDown
                  class="w-5 h-5 transition-transform duration-300"
                  :class="openFaqIndex === index ? 'rotate-180' : ''"
                />
              </span>
            </button>

            <Transition name="faq-answer">
              <div v-if="openFaqIndex === index" class="overflow-hidden">
                <div class="px-6 md:px-7 pb-6 md:pb-7">
                  <div class="h-px mb-5" style="background-color: var(--border-subtle)" />
                  <p
                    class="max-w-2xl text-sm md:text-base leading-relaxed"
                    style="color: var(--text-secondary)"
                  >
                    {{ item.answer }}
                  </p>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Timeline + Support -->
      <div class="mt-24 grid grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] gap-8 lg:gap-10 items-start">
        <!-- Timeline -->
        <div
          ref="timelineEl"
          class="rounded-[2rem] border backdrop-blur-xl p-8 md:p-10 transition-all duration-700"
          :style="[timelineStyle, {
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--glass-bg)',
            boxShadow: '0 20px 60px var(--shadow-color)',
          }]"
        >
          <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div class="max-w-2xl">
              <span
                class="font-bold text-[10px] tracking-[0.3em] uppercase mb-4 block"
                style="color: var(--text-muted)"
              >
                Этапы сотрудничества
              </span>
              <h3
                class="text-4xl md:text-5xl font-display font-bold tracking-tighter leading-[0.95]"
                style="color: var(--text-primary)"
              >
                Понятный процесс<br />
                <span style="color: var(--text-muted)">с реальными дедлайнами</span>
              </h3>
            </div>
            <p
              class="max-w-md text-sm md:text-base leading-relaxed"
              style="color: var(--text-secondary)"
            >
              Сроки зависят от объема задач, но базовый маршрут проекта понятен заранее.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="(item, index) in collaborationTimeline"
              :key="item.step"
              ref="timelineItemEls"
              class="rounded-[1.5rem] border p-5 md:p-6 transition-all duration-500"
              :style="[getTimelineItemStyle(index), {
                borderColor: 'var(--border-subtle)',
                backgroundColor: 'var(--accent-subtle)',
              }]"
            >
              <div class="flex items-start justify-between gap-4 mb-5">
                <div
                  class="w-11 h-11 rounded-2xl text-white flex items-center justify-center font-display font-bold text-sm shadow-lg"
                  style="background-color: var(--accent)"
                >
                  {{ item.step }}
                </div>
                <span
                  class="px-3 py-2 rounded-full border text-[10px] font-bold uppercase tracking-[0.22em]"
                  style="border-color: var(--border-light); color: var(--text-muted); background-color: var(--glass-bg)"
                >
                  {{ item.deadline }}
                </span>
              </div>
              <h4
                class="text-2xl font-display font-bold tracking-tight mb-3"
                style="color: var(--text-primary)"
              >
                {{ item.title }}
              </h4>
              <p
                class="text-sm md:text-base leading-relaxed"
                style="color: var(--text-secondary)"
              >
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Support (dark card) -->
        <div
          ref="supportEl"
          class="rounded-[2rem] border p-8 md:p-10 transition-all duration-700"
          :style="[supportStyle, {
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--accent)',
            boxShadow: '0 24px 70px var(--shadow-strong)',
          }]"
        >
          <span class="text-white/45 font-bold text-[10px] tracking-[0.3em] uppercase mb-4 block">
            Гарантии и поддержка
          </span>
          <h3 class="text-4xl md:text-5xl font-display font-bold tracking-tighter leading-[0.95] text-white">
            Работаем не только<br />
            <span class="text-white/40">до релиза</span>
          </h3>
          <p class="mt-6 text-sm md:text-base text-white/72 leading-relaxed">
            Проект не заканчивается на передаче файлов. Мы закладываем понятные договоренности, контроль качества и сопровождение после запуска.
          </p>

          <div class="mt-8 space-y-3">
            <div
              v-for="(item, index) in supportPromises"
              :key="item"
              ref="promiseEls"
              class="flex items-start gap-4 rounded-[1.4rem] border border-white/10 bg-white/8 px-4 py-4 transition-all duration-500"
              :style="getPromiseStyle(index)"
            >
              <div class="mt-0.5 h-3 w-3 rounded-full bg-white shrink-0" />
              <p class="text-sm md:text-base text-white/82 leading-relaxed">{{ item }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowUpRight, ChevronDown, Globe, Brush, Shapes, Headphones, Bot, Search } from 'lucide-vue-next'

const services = [
  { title: 'Веб-разработка',          description: 'Проектируем и собираем сайты, платформы и сервисы с акцентом на скорость, масштабируемость и визуальную чистоту.',                    tags: ['React', 'Landing', 'Web App'],  icon: Globe },
  { title: 'Дизайн продукта',         description: 'Создаем интерфейсы, которые ощущаются премиально: логика сценариев, структура экранов и выразительная визуальная система.',            tags: ['UI/UX', 'Prototype'],           icon: Brush },
  { title: 'Брендинг',                description: 'Формируем визуальный язык бренда, чтобы продукт выглядел целостно во всех точках контакта.',                                           tags: ['Identity', 'Strategy'],         icon: Shapes },
  { title: 'Техническое сопровождение',description: 'Берем на себя поддержку, обновления, контроль стабильности и развитие продукта после релиза.',                                        tags: ['Support', 'Monitoring'],        icon: Headphones },
  { title: 'Телеграм-боты',           description: 'Разрабатываем ботов для продаж, поддержки, внутренних процессов и автоматизации клиентских сценариев.',                               tags: ['Telegram', 'Automation'],       icon: Bot },
  { title: 'SEO оптимизация',         description: 'Улучшаем видимость проекта в поиске: техническая база, структура страниц, контент и точки роста.',                                    tags: ['SEO', 'Analytics'],             icon: Search },
]

const faqItems = [
  { question: 'Сколько времени занимает запуск проекта?',          answer: 'Обычно первый этап с брифингом, структурой и визуальным направлением занимает от 5 до 10 рабочих дней. Полный срок зависит от объема задач, интеграций и количества экранов.' },
  { question: 'Можно ли заказать только дизайн или только разработку?', answer: 'Да. Мы можем подключиться на отдельный этап: UX/UI, фронтенд, Telegram-бот, SEO или техническую поддержку после релиза.' },
  { question: 'Как строится работа и коммуникация по проекту?',    answer: 'Фиксируем цели, согласовываем этапы и дальше работаем короткими итерациями. Показываем промежуточные результаты, собираем обратную связь и двигаемся по понятному плану без потери темпа.' },
  { question: 'Берете ли вы проекты на поддержку после запуска?',  answer: 'Да, сопровождаем продукт после релиза: обновления, мониторинг, улучшение конверсии, доработка функционала и развитие проекта по мере роста задач.' },
]

const collaborationTimeline = [
  { step: '01', title: 'Созвон и бриф',         deadline: '1-2 дня',  description: 'Уточняем задачу, цели проекта, приоритеты и ограничения, чтобы собрать рабочую основу без лишних допущений.' },
  { step: '02', title: 'Концепция и структура',  deadline: '3-5 дней', description: 'Формируем логику экранов, визуальное направление и ключевые сценарии, чтобы согласовать общее решение до разработки.' },
  { step: '03', title: 'Дизайн и реализация',    deadline: '7-21 день',description: 'Собираем интерфейс, подключаем нужный функционал и доводим продукт до состояния, готового к запуску.' },
  { step: '04', title: 'Тесты и запуск',         deadline: '2-4 дня',  description: 'Проверяем стабильность, вносим финальные правки, публикуем проект и готовим его к реальной нагрузке.' },
]

const supportPromises = [
  'Фиксируем этапы, сроки и состав работ до старта.',
  'Держим прозрачную коммуникацию по статусам и следующим шагам.',
  'Не исчезаем после релиза: остаемся на поддержке и развитии.',
  'Приоритетно закрываем критические баги и технические вопросы.',
]

const openFaqIndex = ref(0)

// Refs
const serviceEls      = ref<HTMLElement[]>([])
const faqHeaderEl     = ref<HTMLElement | null>(null)
const faqEls          = ref<HTMLElement[]>([])
const timelineEl      = ref<HTMLElement | null>(null)
const timelineItemEls = ref<HTMLElement[]>([])
const supportEl       = ref<HTMLElement | null>(null)
const promiseEls      = ref<HTMLElement[]>([])

// Visibility state
const visibleServices      = ref<boolean[]>(services.map(() => false))
const faqHeaderVisible     = ref(false)
const visibleFaqs          = ref<boolean[]>(faqItems.map(() => false))
const timelineVisible      = ref(false)
const visibleTimelineItems = ref<boolean[]>(collaborationTimeline.map(() => false))
const supportVisible       = ref(false)
const visiblePromises      = ref<boolean[]>(supportPromises.map(() => false))

// Style functions
function getServiceStyle(i: number) {
  return { opacity: visibleServices.value[i] ? 1 : 0, transform: visibleServices.value[i] ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.98)', transition: `opacity 0.55s ease ${i * 0.06}s, transform 0.55s ease ${i * 0.06}s` }
}
const faqHeaderStyle = computed(() => ({ opacity: faqHeaderVisible.value ? 1 : 0, transform: faqHeaderVisible.value ? 'translateY(0)' : 'translateY(24px)' }))
function getFaqStyle(i: number) {
  return { opacity: visibleFaqs.value[i] ? 1 : 0, transform: visibleFaqs.value[i] ? 'translateY(0)' : 'translateY(20px)', transition: `opacity 0.45s ease ${i * 0.06}s, transform 0.45s ease ${i * 0.06}s` }
}
const timelineStyle = computed(() => ({ opacity: timelineVisible.value ? 1 : 0, transform: timelineVisible.value ? 'translateY(0)' : 'translateY(24px)' }))
function getTimelineItemStyle(i: number) {
  return { opacity: visibleTimelineItems.value[i] ? 1 : 0, transform: visibleTimelineItems.value[i] ? 'translateY(0)' : 'translateY(18px)', transition: `opacity 0.45s ease ${i * 0.06}s, transform 0.45s ease ${i * 0.06}s` }
}
const supportStyle = computed(() => ({ opacity: supportVisible.value ? 1 : 0, transform: supportVisible.value ? 'translateY(0)' : 'translateY(24px)', transitionDelay: '0.08s' }))
function getPromiseStyle(i: number) {
  return { opacity: visiblePromises.value[i] ? 1 : 0, transform: visiblePromises.value[i] ? 'translateX(0)' : 'translateX(18px)', transition: `opacity 0.4s ease ${i * 0.07}s, transform 0.4s ease ${i * 0.07}s` }
}

onMounted(async () => {
  await nextTick()

  const makeObs = (els: HTMLElement[], visible: Ref<boolean[]>, opts?: IntersectionObserverInit) => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const idx = els.indexOf(e.target as HTMLElement)
        if (e.isIntersecting && idx !== -1) visible.value[idx] = true
      })
    }, { threshold: 0.1, rootMargin: '-80px', ...opts })
    els.forEach((el) => el && obs.observe(el))
  }
  const makeSingle = (el: HTMLElement | null, visible: Ref<boolean>) => {
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) visible.value = true }, { threshold: 0.1, rootMargin: '-80px' })
    obs.observe(el)
  }

  makeObs(serviceEls.value, visibleServices)
  makeSingle(faqHeaderEl.value, faqHeaderVisible)
  makeObs(faqEls.value, visibleFaqs)
  makeSingle(timelineEl.value, timelineVisible)
  makeObs(timelineItemEls.value, visibleTimelineItems)
  makeSingle(supportEl.value, supportVisible)
  makeObs(promiseEls.value, visiblePromises)
})
</script>

<style scoped>
.faq-answer-enter-active,
.faq-answer-leave-active {
  transition: max-height 0.28s ease, opacity 0.28s ease;
  overflow: hidden;
  max-height: 300px;
}
.faq-answer-enter-from,
.faq-answer-leave-to { max-height: 0; opacity: 0; }
</style>
