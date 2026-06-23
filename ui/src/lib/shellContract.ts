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
