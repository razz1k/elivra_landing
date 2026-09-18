import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/components.css'
import './styles/sections.css'

import { site } from './config'
import { initFaq } from './modules/faq'
import { initNav } from './modules/nav'
import { initParallax } from './modules/parallax'
import { initReveal } from './modules/reveal'

function applyContactLinks(): void {
  document.querySelectorAll<HTMLAnchorElement>('[data-contact]').forEach((link) => {
    const key = link.dataset.contact
    switch (key) {
      case 'telegram':
        link.href = site.telegramUrl
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

    if (key === 'telegram' || key === 'whatsapp' || key === 'instagram') {
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  applyContactLinks()
  initNav()
  initFaq()
  initReveal()
  initParallax()
})
