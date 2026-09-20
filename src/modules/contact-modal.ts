import { site } from '../config'

interface ContactOption {
  key: string
  label: string
  href: string
}

const getContactOptions = (): ContactOption[] => [
  { key: 'telegram', label: 'Telegram', href: site.telegramUrl },
  { key: 'whatsapp', label: 'WhatsApp', href: site.whatsappUrl },
  { key: 'instagram', label: 'Instagram', href: site.instagramUrl },
  { key: 'vk', label: 'VK', href: site.vkUrl },
  { key: 'phone', label: site.phone, href: site.phoneHref },
  { key: 'email', label: site.email, href: site.emailHref },
]

export function initContactModal(): void {
  const modal = document.getElementById('contact-modal')
  const overlay = modal?.querySelector('.contact-modal__overlay') as HTMLElement
  const closeBtn = modal?.querySelector('.contact-modal__close') as HTMLButtonElement
  const links = modal?.querySelectorAll('.contact-modal__link') as NodeListOf<HTMLAnchorElement>

  if (!modal) return

  let lastFocusedElement: HTMLElement | null = null

  const openModal = (): void => {
    lastFocusedElement = document.activeElement as HTMLElement
    modal.setAttribute('aria-hidden', 'false')
    document.body.style.overflow = 'hidden'
    closeBtn.focus()
  }

  const closeModal = (): void => {
    modal.setAttribute('aria-hidden', 'true')
    document.body.style.overflow = ''
    if (lastFocusedElement) {
      lastFocusedElement.focus()
    }
  }

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      closeModal()
    }
  }

  const handleOverlayClick = (event: MouseEvent): void => {
    if (event.target === overlay) {
      closeModal()
    }
  }

  const applyContactLinks = (): void => {
    links.forEach((link) => {
      const key = link.dataset.contact
      if (key) {
        const options = getContactOptions()
        const option = options.find((o) => o.key === key)
        if (option) {
          link.href = option.href
          if (key === 'phone' || key === 'email') {
            link.textContent = option.label
          }
          link.target = '_blank'
          link.rel = 'noopener noreferrer'
        }
      }
    })
  }

  const attachCTAListeners = (): void => {
    // Listen for clicks on CTA buttons that should open the modal
    const ctaSelector = '.btn-cta-modal, a[data-contact][data-cta-modal]'
    const ctaButtons = document.querySelectorAll<HTMLElement>(ctaSelector)

    ctaButtons.forEach((cta) => {
      cta.addEventListener('click', (e) => {
        e.preventDefault()
        openModal()
      })
    })
  }

  // Event listeners
  closeBtn?.addEventListener('click', closeModal)
  overlay?.addEventListener('click', handleOverlayClick)
  document.addEventListener('keydown', handleKeyDown)

  // Apply contact links
  applyContactLinks()

  // Attach CTA listeners
  attachCTAListeners()
}
