<template>
  <section
    id="calculator"
    class="section-padding relative overflow-hidden"
    style="background-color: var(--bg-secondary)"
  >
    <div class="max-w-5xl mx-auto px-6 relative z-10">
      <div class="text-center mb-12">
        <span
          class="font-bold text-[10px] tracking-[0.2em] uppercase mb-4 block"
          style="color: var(--text-muted)"
        >
          Калькулятор
        </span>
        <h2 style="color: var(--text-primary)">Оцените ваш проект</h2>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Left: Options -->
        <div class="lg:col-span-7 space-y-8">
          <!-- Main Service -->
          <div>
            <h4
              class="text-[10px] font-bold uppercase tracking-widest mb-4"
              style="color: var(--text-muted)"
            >
              Основная услуга
            </h4>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="s in SERVICES"
                :key="s.id"
                class="p-4 rounded-xl border text-left transition-all duration-300"
                :style="selectedService === s.id
                  ? { backgroundColor: 'var(--accent)', borderColor: 'var(--accent)', color: '#fff', boxShadow: '0 4px 20px var(--accent-subtle3)' }
                  : { backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }"
                @click="selectedService = s.id"
              >
                <div class="text-sm font-bold mb-1">{{ s.name }}</div>
                <div
                  class="text-[10px]"
                  :style="{ color: selectedService === s.id ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)' }"
                >
                  от {{ formatUsd(s.basePrice) }}
                </div>
              </button>
            </div>
          </div>

          <!-- Options -->
          <div>
            <h4
              class="text-[10px] font-bold uppercase tracking-widest mb-4"
              style="color: var(--text-muted)"
            >
              Дополнительно
            </h4>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="o in OPTIONS"
                :key="o.id"
                class="p-4 rounded-xl border text-left transition-all duration-300"
                :style="selectedOptions.includes(o.id)
                  ? { backgroundColor: 'var(--accent)', borderColor: 'var(--accent)', color: '#fff', boxShadow: '0 4px 20px var(--accent-subtle3)' }
                  : { backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }"
                @click="toggleOption(o.id)"
              >
                <div class="text-sm font-bold mb-1">{{ o.name }}</div>
                <div
                  class="text-[10px]"
                  :style="{ color: selectedOptions.includes(o.id) ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)' }"
                >
                  +{{ formatUsd(o.price) }}
                </div>
              </button>
            </div>
          </div>

          <!-- Pages slider -->
          <div>
            <div class="flex justify-between items-center mb-4">
              <h4
                class="text-[10px] font-bold uppercase tracking-widest"
                style="color: var(--text-muted)"
              >
                Объем (экраны/страницы)
              </h4>
              <div
                class="flex items-center gap-4 px-3 py-1 rounded-lg"
                style="background-color: var(--accent-subtle)"
              >
                <button style="color: var(--text-primary)" @click="pages = Math.max(1, pages - 1)">
                  <Minus class="w-3 h-3" />
                </button>
                <span class="text-sm font-bold w-4 text-center" style="color: var(--text-primary)">{{ pages }}</span>
                <button style="color: var(--text-primary)" @click="pages++">
                  <Plus class="w-3 h-3" />
                </button>
              </div>
            </div>
            <input
              v-model.number="pages"
              type="range"
              min="1"
              max="20"
              class="w-full h-1 rounded-lg appearance-none cursor-pointer"
              style="background-color: var(--border-light); accent-color: var(--accent)"
            />
          </div>
        </div>

        <!-- Right: Summary -->
        <div class="lg:col-span-5">
          <div
            class="glass-card p-8 rounded-2xl sticky top-24"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="p-2 rounded-lg"
                style="background-color: var(--accent-subtle)"
              >
                <Calculator class="w-4 h-4" style="color: var(--accent)" />
              </div>
              <h3
                class="text-lg font-display font-bold"
                style="color: var(--text-primary)"
              >
                Итого
              </h3>
            </div>

            <div
              class="text-4xl font-display font-bold mb-2"
              style="color: var(--text-primary)"
            >
              {{ formatUsd(total) }}
            </div>
            <p
              class="text-[10px] mb-8 uppercase tracking-widest font-bold"
              style="color: var(--text-muted)"
            >
              Ориентировочная стоимость
            </p>

            <div class="space-y-4 mb-8">
              <button
                :disabled="isAiLoading"
                class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[10px] font-bold transition-colors disabled:opacity-50"
                style="background-color: var(--accent-subtle); color: var(--text-primary)"
                @click="getAiSuggestion"
              >
                <Loader2 v-if="isAiLoading" class="w-3 h-3 animate-spin" />
                <Sparkles v-else class="w-3 h-3" />
                Совет от ИИ
              </button>

              <Transition name="ai-suggestion">
                <div
                  v-if="aiSuggestion"
                  class="p-4 rounded-xl border"
                  style="background-color: var(--accent-subtle); border-color: var(--border-subtle)"
                >
                  <div
                    class="text-[9px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1"
                    style="color: var(--text-muted)"
                  >
                    <Sparkles class="w-2 h-2" /> Рекомендация
                  </div>
                  <p
                    class="text-[11px] leading-relaxed italic"
                    style="color: var(--text-secondary)"
                  >
                    "{{ aiSuggestion }}"
                  </p>
                </div>
              </Transition>
            </div>

            <NuxtLink
              to="/brief"
              class="navy-button w-full flex items-center justify-center gap-2 group"
            >
              Обсудить проект
              <ChevronRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Calculator, ChevronRight, Sparkles, Loader2, Plus, Minus } from 'lucide-vue-next'

const SERVICES = [
  { id: 'web',      name: 'Веб-разработка',  basePrice: 100 },
  { id: 'design',   name: 'Дизайн продукта', basePrice: 350 },
  { id: 'branding', name: 'Брендинг',        basePrice: 450 },
  { id: 'marketing',name: 'Маркетинг',       basePrice: 250 },
]
const OPTIONS = [
  { id: 'mobile',  name: 'Мобильная версия',    price: 50 },
  { id: 'seo',     name: 'SEO оптимизация',     price: 120 },
  { id: 'cms',     name: 'Интеграция CMS',      price: 230 },
  { id: 'support', name: 'Техподдержка (1 мес)',price: 70 },
]

const selectedService = ref(SERVICES[0].id)
const selectedOptions = ref<string[]>([])
const pages = ref(1)
const aiSuggestion = ref<string | null>(null)
const isAiLoading = ref(false)

const total = computed(() => {
  const service = SERVICES.find((s) => s.id === selectedService.value)
  const optionsPrice = selectedOptions.value.reduce((acc, optId) => {
    const option = OPTIONS.find((o) => o.id === optId)
    return acc + (option?.price || 0)
  }, 0)
  return Math.round(((service?.basePrice || 0) + optionsPrice) * (1 + (pages.value - 1) * 0.5))
})

function formatUsd(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}
function toggleOption(id: string) {
  const idx = selectedOptions.value.indexOf(id)
  if (idx === -1) selectedOptions.value.push(id)
  else selectedOptions.value.splice(idx, 1)
}
async function getAiSuggestion() {
  isAiLoading.value = true
  try {
    const serviceName = SERVICES.find((s) => s.id === selectedService.value)?.name
    const optionNames = selectedOptions.value.map((id) => OPTIONS.find((o) => o.id === id)?.name)
    const response = await $fetch<{ suggestion: string }>('/api/ai-suggestion', {
      method: 'POST',
      body: { serviceName, optionNames: optionNames.filter(Boolean) },
    })
    aiSuggestion.value = response.suggestion
  } catch {
    aiSuggestion.value = 'Ошибка при получении рекомендаций.'
  } finally {
    isAiLoading.value = false
  }
}
</script>

<style scoped>
.ai-suggestion-enter-active,
.ai-suggestion-leave-active {
  transition: opacity 0.3s ease, max-height 0.3s ease;
  overflow: hidden;
  max-height: 200px;
}
.ai-suggestion-enter-from,
.ai-suggestion-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
