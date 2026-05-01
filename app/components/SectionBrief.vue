<template>
  <div>
    <!-- Success state -->
    <div
      v-if="submitted"
      class="min-h-screen flex items-center justify-center px-6 pt-20"
      style="background-color: var(--bg-primary)"
    >
      <div
        class="max-w-md w-full text-center p-12 glass-card rounded-2xl"
      >
        <div
          class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
          style="background-color: var(--accent-subtle)"
        >
          <CheckCircle class="w-10 h-10" style="color: var(--accent)" />
        </div>
        <h2
          class="text-2xl font-display font-bold mb-4"
          style="color: var(--text-primary)"
        >
          Бриф отправлен!
        </h2>
        <p
          class="mb-8 leading-relaxed text-sm"
          style="color: var(--text-secondary)"
        >
          Спасибо за доверие. Наш стратег изучит ваш проект и свяжется с вами в течение 24 часов.
        </p>
        <NuxtLink to="/" class="navy-button w-full inline-flex justify-center">
          Вернуться на главную
        </NuxtLink>
      </div>
    </div>

    <!-- Form -->
    <div
      v-else
      class="min-h-screen pt-32 pb-20 px-6"
      style="background-color: var(--bg-secondary)"
    >
      <div class="max-w-2xl mx-auto">
        <div class="mb-12">
          <NuxtLink
            to="/"
            class="text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 mb-8"
            style="color: var(--text-muted)"
          >
            <ChevronLeft class="w-3 h-3" /> Назад
          </NuxtLink>
          <div class="flex justify-between items-end mb-4">
            <h1
              class="text-3xl md:text-4xl font-display font-bold"
              style="color: var(--text-primary)"
            >
              Бриф проекта
            </h1>
            <span
              class="text-[10px] font-bold uppercase tracking-widest"
              style="color: var(--text-muted)"
            >
              Шаг {{ step }} из 3
            </span>
          </div>
          <!-- Progress bar -->
          <div
            class="h-1 rounded-full overflow-hidden"
            style="background-color: var(--border-subtle)"
          >
            <div
              class="h-full rounded-full transition-all duration-500"
              :style="{ width: `${(step / 3) * 100}%`, backgroundColor: 'var(--accent)' }"
            />
          </div>
        </div>

        <form
          class="glass-card p-8 md:p-12 rounded-2xl"
          @submit.prevent="handleSubmit"
        >
          <Transition name="step-slide" mode="out-in">
            <!-- Step 1 -->
            <div v-if="step === 1" key="step1" class="space-y-6">
              <h3
                class="text-lg font-display font-bold mb-8"
                style="color: var(--text-primary)"
              >
                Контактная информация
              </h3>
              <div class="space-y-4">
                <div v-for="field in step1Fields" :key="field.key">
                  <label
                    class="block text-[10px] font-bold uppercase tracking-widest mb-2"
                    style="color: var(--text-muted)"
                  >
                    {{ field.label }}
                  </label>
                  <input
                    v-model="formData[field.key as keyof typeof formData]"
                    :type="field.type"
                    :required="field.required"
                    :placeholder="field.placeholder"
                    class="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                    :style="inputStyle"
                  />
                </div>
              </div>
              <button
                type="button"
                class="navy-button w-full flex items-center justify-center gap-2"
                @click="nextStep"
              >
                Далее <ChevronRight class="w-4 h-4" />
              </button>
            </div>

            <!-- Step 2 -->
            <div v-else-if="step === 2" key="step2" class="space-y-6">
              <h3
                class="text-lg font-display font-bold mb-8"
                style="color: var(--text-primary)"
              >
                О проекте
              </h3>
              <div class="space-y-4">
                <!-- Service type dropdown -->
                <div>
                  <label
                    class="block text-[10px] font-bold uppercase tracking-widest mb-2"
                    style="color: var(--text-muted)"
                  >
                    Тип услуги
                  </label>
                  <div ref="projectTypeRef" class="relative">
                    <button
                      type="button"
                      class="w-full rounded-xl px-4 py-3 text-sm text-left transition-all duration-300 flex items-center justify-between border"
                      :style="isProjectTypeOpen
                        ? { borderColor: 'var(--accent)', boxShadow: '0 18px 45px var(--shadow-strong)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }
                        : { borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }"
                      @click="isProjectTypeOpen = !isProjectTypeOpen"
                    >
                      <span>{{ formData.projectType }}</span>
                      <ChevronDown
                        class="w-4 h-4 transition-transform duration-300"
                        :class="isProjectTypeOpen ? 'rotate-180' : ''"
                        :style="{ color: isProjectTypeOpen ? 'var(--accent)' : 'var(--text-muted)' }"
                      />
                    </button>

                    <Transition name="dropdown">
                      <div
                        v-if="isProjectTypeOpen"
                        class="absolute z-30 left-0 right-0 top-[calc(100%+0.6rem)] overflow-hidden rounded-2xl border backdrop-blur-xl"
                        :style="{ borderColor: 'var(--border-light)', backgroundColor: 'var(--glass-bg-solid)', boxShadow: '0 22px 60px var(--shadow-strong)' }"
                      >
                        <div class="p-2">
                          <button
                            v-for="type in PROJECT_TYPES"
                            :key="type"
                            type="button"
                            class="w-full rounded-xl px-4 py-3 text-left text-sm transition-all duration-200"
                            :style="formData.projectType === type
                              ? { backgroundColor: 'var(--accent)', color: '#fff' }
                              : { color: 'var(--text-primary)' }"
                            @click="formData.projectType = type; isProjectTypeOpen = false"
                          >
                            <span class="block font-medium">{{ type }}</span>
                            <span
                              class="mt-1 block text-[10px] uppercase tracking-[0.22em]"
                              :style="{ color: formData.projectType === type ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)' }"
                            >
                              {{ formData.projectType === type ? 'Выбрано' : 'Выбрать' }}
                            </span>
                          </button>
                        </div>
                      </div>
                    </Transition>
                  </div>
                </div>

                <!-- Budget -->
                <div>
                  <label
                    class="block text-[10px] font-bold uppercase tracking-widest mb-2"
                    style="color: var(--text-muted)"
                  >
                    Примерный бюджет
                  </label>
                  <input
                    v-model="formData.budget"
                    type="text"
                    placeholder="от 100 $"
                    class="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors border"
                    :style="inputStyle"
                  />
                </div>
              </div>
              <div class="flex gap-4">
                <button type="button" class="outline-button flex-1" @click="prevStep">Назад</button>
                <button
                  type="button"
                  class="navy-button flex-[2] flex items-center justify-center gap-2"
                  @click="nextStep"
                >
                  Далее <ChevronRight class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Step 3 -->
            <div v-else-if="step === 3" key="step3" class="space-y-6">
              <h3
                class="text-lg font-display font-bold mb-8"
                style="color: var(--text-primary)"
              >
                Детали
              </h3>
              <div>
                <label
                  class="block text-[10px] font-bold uppercase tracking-widest mb-2"
                  style="color: var(--text-muted)"
                >
                  Описание задачи
                </label>
                <textarea
                  v-model="formData.description"
                  rows="5"
                  placeholder="Расскажите о ваших целях..."
                  class="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors resize-none border"
                  :style="inputStyle"
                />
              </div>
              <div class="flex gap-4">
                <button type="button" class="outline-button flex-1" @click="prevStep">Назад</button>
                <button
                  type="submit"
                  class="navy-button flex-[2] flex items-center justify-center gap-2"
                >
                  Отправить бриф <Send class="w-4 h-4" />
                </button>
              </div>
            </div>
          </Transition>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Send, CheckCircle, ChevronRight, ChevronLeft, ChevronDown } from 'lucide-vue-next'

const PROJECT_TYPES = [
  'Веб-разработка', 'Техническое сопровождение', 'Телеграм-боты',
  'SEO оптимизация', 'Брендинг', 'Дизайн продукта', 'Маркетинг',
]

const step1Fields = [
  { key: 'name',  label: 'Ваше имя',       type: 'text',  required: true, placeholder: 'Иван Иванов' },
  { key: 'email', label: 'Email',           type: 'email', required: true, placeholder: 'hello@example.com' },
  { key: 'phone', label: 'Номер телефона',  type: 'tel',   required: true, placeholder: '+7 (999) 000-0000' },
]

const step = ref(1)
const submitted = ref(false)
const isProjectTypeOpen = ref(false)
const projectTypeRef = ref<HTMLElement | null>(null)

const formData = reactive({
  name: '', email: '', phone: '', company: '',
  projectType: PROJECT_TYPES[0], budget: '', description: '', timeline: '',
})

// Dynamic input style using CSS vars
const inputStyle = computed(() => ({
  backgroundColor: 'var(--bg-primary)',
  borderColor: 'var(--border-subtle)',
  color: 'var(--text-primary)',
}))

function nextStep() { step.value++ }
function prevStep() { step.value-- }
function handleSubmit() { submitted.value = true }

function handleClickOutside(e: MouseEvent) {
  if (projectTypeRef.value && !projectTypeRef.value.contains(e.target as Node)) {
    isProjectTypeOpen.value = false
  }
}
onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))
</script>

<style scoped>
.step-slide-enter-active,
.step-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.step-slide-enter-from { opacity: 0; transform: translateX(20px); }
.step-slide-leave-to   { opacity: 0; transform: translateX(-20px); }

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
</style>
