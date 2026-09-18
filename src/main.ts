import './styles/entry.css'
import { site } from './config'
import { initNav } from './modules/nav'
import { initReveal } from './modules/reveal'
import { initStatsCount } from './modules/stats-count'

function applyContactLinks(): void {
  document.querySelectorAll<HTMLAnchorElement>('[data-contact]').forEach((link) => {
    const key = link.dataset.contact
    switch (key) {
      case 'telegram':
        link.href = site.telegramUrl
        break
      case 'max':
        link.href = site.maxUrl
        break
      case 'whatsapp':
        link.href = site.whatsappUrl
        break
      case 'instagram':
        link.href = site.instagramUrl
        break
      case 'phone':
        link.href = site.phoneHref
        link.textContent = site.phone
        break
      case 'email':
        link.href = site.emailHref
        link.textContent = site.email
        break
      default:
        break
    }

    if (key === 'telegram' || key === 'max' || key === 'whatsapp' || key === 'instagram') {
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
    }
  })
}

function boot(): void {
  applyContactLinks()
  initNav()
  initReveal()
  initStatsCount()
  void import('./styles/caveat.css')
  void import('./modules/cursor-follow').then((module) => {
    module.initCursorFollow()
  })
}

boot()
