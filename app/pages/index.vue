<template>
  <div class="relative alcantara-bg overflow-hidden">
    <div class="relative z-10">
      <SectionHero />
      <SectionAbout />
      <SectionFeatures />
      <SectionProcess />
      <SectionMarquee />
      <SectionServices />
      <SectionCases />
      <SectionCalculator />
      <SectionCTA />
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Auraa — Digital Agency',
})

// Handle anchor scroll on load
onMounted(() => {
  const hash = window.location.hash
  if (hash) {
    const el = document.getElementById(hash.replace('#', ''))
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }
})
</script>
