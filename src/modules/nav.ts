export function initNav(): void {
  const header = document.querySelector<HTMLElement>('.site-header')
  const toggle = document.querySelector<HTMLButtonElement>('.nav-toggle')
  const mobileNav = document.querySelector<HTMLElement>('.mobile-nav')

  if (!header || !toggle || !mobileNav) return

  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open))
    mobileNav.classList.toggle('is-open', open)
    document.body.style.overflow = open ? 'hidden' : ''
  }

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true'
    setOpen(open)
  })

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false))
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false)
  })

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12)
  }

  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
}
