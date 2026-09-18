const UPDATE_INTERVAL_MS = 200
const WAVE_STEP_PX = 100
const WAVE_MIN_INTERVAL_MS = 500

export function initCursorFollow(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (window.matchMedia('(pointer: coarse)').matches) return

  const stages = document.querySelectorAll<HTMLElement>('[data-cursor-stage]')
  if (!stages.length) return

  stages.forEach((stage) => {
    const layers = stage.querySelectorAll<HTMLElement>('[data-follow-cursor]')
    const soundMeters = stage.querySelectorAll<HTMLElement>('[data-sound-meter]')
    if (!layers.length && !soundMeters.length) return

    let debounceTimer = 0
    let rafId = 0
    let lastUpdateAt = 0
    let pendingX = 0
    let pendingY = 0
    let hasPending = false
    let lastPointerX: number | null = null
    let lastPointerY: number | null = null
    let travelBudget = 0
    let waveLevel = 0
    let lastWaveChangeAt = 0

    const applyWaveLevel = (level: number) => {
      soundMeters.forEach((meter) => {
        meter.dataset.waves = String(level)
        meter.querySelectorAll<SVGElement>('[data-sound-wave]').forEach((wave) => {
          const index = Number(wave.dataset.soundWave)
          wave.classList.toggle('is-active', index > 0 && index <= level)
        })
      })
    }

    applyWaveLevel(0)

    const paint = () => {
      rafId = 0
      lastUpdateAt = performance.now()

      if (!hasPending) return
      hasPending = false

      const rect = stage.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      const offsetX = (pendingX - rect.left) / rect.width - 0.5
      const offsetY = (pendingY - rect.top) / rect.height - 0.5

      layers.forEach((layer) => {
        const strength = Number(layer.dataset.followStrength) || 10
        layer.style.transform = `translate3d(${offsetX * strength}px, ${offsetY * strength}px, 0)`
      })

      if (lastPointerX !== null && lastPointerY !== null) {
        travelBudget += Math.hypot(pendingX - lastPointerX, pendingY - lastPointerY)

        if (
          travelBudget >= WAVE_STEP_PX &&
          lastUpdateAt - lastWaveChangeAt >= WAVE_MIN_INTERVAL_MS
        ) {
          travelBudget = 0
          lastWaveChangeAt = lastUpdateAt
          waveLevel = (waveLevel + 1) % 3
          applyWaveLevel(waveLevel)
        } else if (travelBudget > WAVE_STEP_PX) {
          travelBudget = WAVE_STEP_PX
        }
      }

      lastPointerX = pendingX
      lastPointerY = pendingY
    }

    const queueOnFrame = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(paint)
    }

    const scheduleUpdate = () => {
      const elapsed = performance.now() - lastUpdateAt
      if (elapsed >= UPDATE_INTERVAL_MS) {
        if (debounceTimer) {
          window.clearTimeout(debounceTimer)
          debounceTimer = 0
        }
        queueOnFrame()
        return
      }

      if (!debounceTimer) {
        debounceTimer = window.setTimeout(() => {
          debounceTimer = 0
          queueOnFrame()
        }, UPDATE_INTERVAL_MS - elapsed)
      }
    }

    stage.addEventListener(
      'pointermove',
      (event) => {
        pendingX = event.clientX
        pendingY = event.clientY
        hasPending = true
        scheduleUpdate()
      },
      { passive: true },
    )

    stage.addEventListener(
      'pointerleave',
      () => {
        if (debounceTimer) {
          window.clearTimeout(debounceTimer)
          debounceTimer = 0
        }
        if (rafId) {
          window.cancelAnimationFrame(rafId)
          rafId = 0
        }

        hasPending = false
        lastPointerX = null
        lastPointerY = null
        travelBudget = 0
        waveLevel = 0
        lastWaveChangeAt = 0
        lastUpdateAt = 0
        applyWaveLevel(0)

        rafId = window.requestAnimationFrame(() => {
          rafId = 0
          layers.forEach((layer) => {
            layer.style.transform = 'translate3d(0, 0, 0)'
          })
        })
      },
      { passive: true },
    )
  })
}
