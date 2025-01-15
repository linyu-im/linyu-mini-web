import { useThemeStore } from '@/stores/useThemeStore.js'
import { nextTick } from 'vue'

export function toggleDark(event, theme) {
  const themeStore = useThemeStore()
  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const isDark = theme === 'dark'
  const transition = document.startViewTransition(async () => {
    await themeStore.setTheme(theme)
    document.documentElement.className = theme
    await nextTick()
  })
  transition.ready.then(() => {
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
    document.documentElement.animate(
      {
        clipPath: isDark ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 400,
        easing: 'ease-out',
        pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)',
      },
    )
  })
}
