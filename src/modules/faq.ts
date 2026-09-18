export function initFaq(): void {
  const items = document.querySelectorAll<HTMLElement>('.faq-item')

  items.forEach((item) => {
    const trigger = item.querySelector<HTMLButtonElement>('.faq-item__trigger')
    if (!trigger) return

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open')

      items.forEach((other) => {
        other.classList.remove('is-open')
        other
          .querySelector('.faq-item__trigger')
          ?.setAttribute('aria-expanded', 'false')
      })

      if (!isOpen) {
        item.classList.add('is-open')
        trigger.setAttribute('aria-expanded', 'true')
      }
    })
  })
}
