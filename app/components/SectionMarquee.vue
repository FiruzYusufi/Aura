<template>
  <section
    class="relative h-[400px] overflow-hidden flex items-center justify-center"
    style="background-color: var(--bg-primary)"
  >
    <div
      class="absolute inset-0 opacity-50"
      style="background: radial-gradient(circle, var(--accent-subtle2) 0%, transparent 70%)"
    />

    <!-- First Marquee - Tilted Right -->
    <div class="absolute w-[150%] rotate-[-5deg] z-10">
      <div
        class="flex overflow-hidden whitespace-nowrap border-y py-6 backdrop-blur-sm shadow-2xl"
        style="border-color: var(--border-light); background-color: var(--glass-bg-strong)"
      >
        <div class="marquee-track marquee-left flex gap-12 items-center w-max">
          <span
            v-for="(word, i) in loopedWords"
            :key="`left-${i}`"
            class="text-4xl md:text-6xl font-display font-black tracking-tighter"
            style="color: var(--text-muted)"
          >
            {{ word }}
          </span>
        </div>
      </div>
    </div>

    <!-- Second Marquee - Tilted Left -->
    <div class="absolute w-[150%] rotate-[5deg] z-20">
      <div
        class="flex overflow-hidden whitespace-nowrap border-y py-6 shadow-2xl"
        style="border-color: var(--border-light); background-color: var(--accent)"
      >
        <div class="marquee-track marquee-right flex gap-12 items-center w-max">
          <span
            v-for="(word, i) in loopedWords"
            :key="`right-${i}`"
            class="text-4xl md:text-6xl font-display font-black tracking-tighter text-white/90"
          >
            {{ word }}
          </span>
        </div>
      </div>
    </div>

    <!-- Glow -->
    <div class="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
      <div
        class="w-64 h-64 rounded-full blur-[100px]"
        style="background-color: var(--accent-subtle2)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
const words = [
  'ИННОВАЦИИ', 'ДИЗАЙН', 'СТРАТЕГИЯ', 'РАЗРАБОТКА', 'AURA DIGITAL', 'БУДУЩЕЕ', 'КРЕАТИВ', 'ЭСТЕТИКА', 'КАЧЕСТВО',
]
const loopedWords = [...words, ...words]
</script>
