const DURATION_MS = 1400
const START_OFFSET = 100

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

function animateCount(el: HTMLElement, target: number, suffix: string): void {
  const from = Math.max(0, target - START_OFFSET)
  let start: number | undefined

  const step = (timestamp: number) => {
    if (start === undefined) start = timestamp
    const progress = Math.min((timestamp - start) / DURATION_MS, 1)
    const value = Math.round(from + (target - from) * easeOutCubic(progress))
    el.textContent = `${value}${suffix}`
    if (progress < 1) requestAnimationFrame(step)
  }

  el.textContent = `${from}${suffix}`
  requestAnimationFrame(step)
}

export function initStatsCount(): void {
  const nodes = document.querySelectorAll<HTMLElement>('[data-count]')
  if (!nodes.length) return

  const showFinal = (el: HTMLElement) => {
    const target = Number(el.dataset.count)
    const suffix = el.dataset.countSuffix ?? ''
    if (!Number.isFinite(target)) return
    el.textContent = `${target}${suffix}`
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    nodes.forEach(showFinal)
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const el = entry.target as HTMLElement
        const target = Number(el.dataset.count)
        const suffix = el.dataset.countSuffix ?? ''
        if (Number.isFinite(target)) {
          animateCount(el, target, suffix)
        }
        observer.unobserve(el)
      })
    },
    { threshold: 0.35, rootMargin: '0px 0px -40px 0px' },
  )

  nodes.forEach((el) => {
    const target = Number(el.dataset.count)
    const suffix = el.dataset.countSuffix ?? ''
    if (!Number.isFinite(target)) return
    el.textContent = `${Math.max(0, target - START_OFFSET)}${suffix}`
    observer.observe(el)
  })
}
