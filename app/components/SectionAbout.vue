<template>
  <section
    id="about"
    class="section-padding relative overflow-hidden"
    style="background-color: var(--bg-primary)"
  >
    <UiParallaxAuraa
      extra-class="text-[52vw] md:text-[30vw] -top-[6%] -right-[20%] md:-right-[8%] rotate-[12deg]"
      :speed="0.8"
    />
    <div class="max-w-6xl mx-auto px-6 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        <!-- Image column -->
        <div
          ref="imgCol"
          class="lg:col-span-5 relative transition-all duration-700"
          :style="imgColStyle"
        >
          <div
            class="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl relative border"
            style="border-color: var(--border-subtle)"
          >
            <img
              src="https://picsum.photos/seed/aura-minimal/800/1000"
              alt="О компании Aura"
              class="w-full h-full object-cover"
              referrerpolicy="no-referrer"
            />
            <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/45 via-black/10 to-transparent pointer-events-none" />
            <div class="absolute left-6 bottom-6">
              <div class="text-[11px] uppercase tracking-[0.35em] text-white/60 mb-2">Signature</div>
              <div class="font-display text-3xl md:text-4xl font-bold tracking-tight text-white">Auraa</div>
            </div>
          </div>
          <div
            class="absolute -bottom-6 -right-6 glass-card p-6 rounded-2xl hidden md:block"
          >
            <div class="text-3xl font-display font-bold" style="color: var(--text-primary)">1+</div>
            <div class="text-[10px] font-bold uppercase tracking-widest" style="color: var(--text-muted)">Год опыта</div>
          </div>
        </div>

        <!-- Text column -->
        <div
          ref="textCol"
          class="lg:col-span-7 transition-all duration-700"
          :style="textColStyle"
        >
          <span
            class="font-bold text-[10px] tracking-[0.2em] uppercase mb-4 block"
            style="color: var(--text-muted)"
          >
            Наша история
          </span>
          <UiReveal>
            <h2 class="mb-6" style="color: var(--text-primary)">
              Эстетика в каждой <br />
              <span style="color: var(--text-muted)">детали кода</span>
            </h2>
          </UiReveal>
          <div
            class="space-y-4 font-light leading-relaxed text-sm md:text-base max-w-xl"
            style="color: var(--text-secondary)"
          >
            <p>
              Aura — это не просто студия разработки. Это объединение инженеров и дизайнеров, которые верят, что цифровой продукт должен быть безупречным как внутри, так и снаружи.
            </p>
            <p>
              Мы отошли от массового производства в пользу ремесленного подхода. Каждый проект для нас — это вызов создать нечто уникальное, что будет выделяться на фоне шаблонных решений.
            </p>
          </div>

          <div
            class="grid grid-cols-2 gap-8 mt-10 border-t pt-10"
            style="border-color: var(--border-subtle)"
          >
            <div>
              <div class="text-2xl font-display font-bold mb-1" style="color: var(--text-primary)">10+</div>
              <p class="text-[10px] font-bold uppercase tracking-widest" style="color: var(--text-muted)">Проектов</p>
            </div>
            <div>
              <div class="text-2xl font-display font-bold mb-1" style="color: var(--text-primary)">24/7</div>
              <p class="text-[10px] font-bold uppercase tracking-widest" style="color: var(--text-muted)">Поддержка</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const imgCol = ref<HTMLElement | null>(null)
const textCol = ref<HTMLElement | null>(null)
const imgVisible = ref(false)
const textVisible = ref(false)

const imgColStyle = computed(() => ({
  opacity: imgVisible.value ? 1 : 0,
  transform: imgVisible.value ? 'translateX(0)' : 'translateX(-30px)',
}))
const textColStyle = computed(() => ({
  opacity: textVisible.value ? 1 : 0,
  transform: textVisible.value ? 'translateX(0)' : 'translateX(30px)',
}))

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === imgCol.value) imgVisible.value = true
          if (entry.target === textCol.value) textVisible.value = true
        }
      })
    },
    { threshold: 0.1 }
  )
  if (imgCol.value) observer.observe(imgCol.value)
  if (textCol.value) observer.observe(textCol.value)
})
</script>
