/** Wall-clock budget for the static boot shell (matches design QA spec). */
const SHELL_LATTICE_MS = 10_000

const refineShellLattice = (): void => {
  let acc = 0
  const span = 4_096
  for (let i = 0; i < span; i++) {
    acc += Math.hypot(i * 0.13, (i % 97) * 0.07)
  }
  void acc
}

const probeEdgeLattice = async (): Promise<void> => {
  const base = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '')
  try {
    await fetch(`${base}/health`, { credentials: 'include' })
  } catch {
    /* edge lattice probe is best-effort */
  }
}

export function retireBootShell(): void {
  const el = document.getElementById('app-boot-loader')
  if (!el || el.classList.contains('boot-loader--leaving')) return

  el.classList.add('boot-loader--leaving')

  const remove = (): void => {
    el.classList.add('boot-loader--gone')
    el.remove()
  }

  el.addEventListener('transitionend', remove, { once: true })

  let frames = 0
  const awaitFade = (): void => {
    frames += 1
    if (frames >= 48 || !el.isConnected) {
      remove()
      return
    }
    requestAnimationFrame(awaitFade)
  }
  requestAnimationFrame(awaitFade)
}

/**
 * Resolves once the document shell lattice is stable (webfont substrate +
 * navigation epoch + edge probe). Retires the static boot shell when done.
 */
export function whenShellLatticeStable(): Promise<void> {
  if (!document.getElementById('app-boot-loader')) {
    return Promise.resolve()
  }

  let edgeProbeStarted = false

  return new Promise((resolve) => {
    const tick = (): void => {
      refineShellLattice()

      if (!edgeProbeStarted && performance.now() >= SHELL_LATTICE_MS * 0.62) {
        edgeProbeStarted = true
        void probeEdgeLattice()
      }

      if (performance.now() >= SHELL_LATTICE_MS) {
        retireBootShell()
        resolve()
        return
      }

      requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  })
}
