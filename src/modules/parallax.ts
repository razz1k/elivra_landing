export function initParallax(): void {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  const desktop = window.matchMedia('(min-width: 900px)')
  const images = document.querySelectorAll<HTMLElement>('[data-parallax]')

  if (!images.length) return

  let ticking = false

  const update = () => {
    if (media.matches || !desktop.matches) {
      images.forEach((img) => {
        img.style.transform = ''
      })
      ticking = false
      return
    }

    images.forEach((img) => {
      const parent = img.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const center = rect.top + rect.height / 2
      const offset = (center - window.innerHeight / 2) * -0.06
      img.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0) scale(1.04)`
    })

    ticking = false
  }

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(update)
      ticking = true
    }
  }

  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  media.addEventListener('change', update)
  desktop.addEventListener('change', update)
}
