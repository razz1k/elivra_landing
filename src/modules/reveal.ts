export function initReveal(): void {
  const nodes = document.querySelectorAll<HTMLElement>('.reveal')
  if (!nodes.length) return

  const markVisible = (node: Element) => {
    node.classList.add('is-visible')
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    nodes.forEach(markVisible)
    return
  }

  const viewportBottom = window.innerHeight * 0.95

  nodes.forEach((node) => {
    const rect = node.getBoundingClientRect()
    if (rect.top < viewportBottom) {
      markVisible(node)
    }
  })

  document.documentElement.classList.add('reveal-ready')

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.add('reveal-animate')
    })
  })

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          markVisible(entry.target)
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  )

  nodes.forEach((node) => {
    if (!node.classList.contains('is-visible')) {
      observer.observe(node)
    }
  })
}
