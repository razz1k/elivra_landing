export function initCursorFollow(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (window.matchMedia('(pointer: coarse)').matches) return

  const stages = document.querySelectorAll<HTMLElement>('[data-cursor-stage]')
  if (!stages.length) return

  stages.forEach((stage) => {
    const layers = stage.querySelectorAll<HTMLElement>('[data-follow-cursor]')
    const soundMeters = stage.querySelectorAll<HTMLElement>('[data-sound-meter]')
    if (!layers.length && !soundMeters.length) return

    let frame = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let lastPointerX: number | null = null
    let lastPointerY: number | null = null
    let travelBudget = 0
    let waveLevel = 0
    let lastWaveChangeAt = 0
    const waveStepPx = 100
    const waveMinIntervalMs = 500

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

    const render = () => {
      currentX += (targetX - currentX) * 0.12
      currentY += (targetY - currentY) * 0.12

      layers.forEach((layer) => {
        const strength = Number(layer.dataset.followStrength) || 10
        layer.style.transform = `translate3d(${currentX * strength}px, ${currentY * strength}px, 0)`
      })

      if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
        frame = requestAnimationFrame(render)
      } else {
        frame = 0
      }
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render)
    }

    stage.addEventListener(
      'pointermove',
      (event) => {
        const rect = stage.getBoundingClientRect()
        if (!rect.width || !rect.height) return
        targetX = (event.clientX - rect.left) / rect.width - 0.5
        targetY = (event.clientY - rect.top) / rect.height - 0.5

        if (lastPointerX !== null && lastPointerY !== null) {
          const dx = event.clientX - lastPointerX
          const dy = event.clientY - lastPointerY
          travelBudget += Math.hypot(dx, dy)

          const now = performance.now()
          if (travelBudget >= waveStepPx && now - lastWaveChangeAt >= waveMinIntervalMs) {
            travelBudget = 0
            lastWaveChangeAt = now
            waveLevel = (waveLevel + 1) % 3
            applyWaveLevel(waveLevel)
          } else if (travelBudget > waveStepPx) {
            travelBudget = waveStepPx
          }
        }

        lastPointerX = event.clientX
        lastPointerY = event.clientY
        schedule()
      },
      { passive: true },
    )

    stage.addEventListener(
      'pointerleave',
      () => {
        targetX = 0
        targetY = 0
        lastPointerX = null
        lastPointerY = null
        travelBudget = 0
        waveLevel = 0
        lastWaveChangeAt = 0
        applyWaveLevel(0)
        schedule()
      },
      { passive: true },
    )
  })
}
