export function useInView(options?: IntersectionObserverInit) {
  const el = ref<HTMLElement | null>(null)
  const isInView = ref(false)

  onMounted(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isInView.value = true
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '-80px', ...options }
    )
    if (el.value) observer.observe(el.value)
  })

  return { el, isInView }
}
