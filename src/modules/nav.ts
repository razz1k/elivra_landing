export function initNav(): void {
  const header = document.querySelector<HTMLElement>('.site-header')
  const toggle = document.querySelector<HTMLInputElement>('.nav-toggle-input')
  const mobileNav = document.querySelector<HTMLElement>('.mobile-nav')

  if (!header) return

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12)
  }

  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })

  if (!toggle || !mobileNav) return

  const closeMenu = () => {
    toggle.checked = false
  }

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu)
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu()
  })
}
