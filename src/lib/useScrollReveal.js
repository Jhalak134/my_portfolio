import { useEffect, useRef, useCallback } from 'react'

/**
 * Attaches scroll-reveal to .reveal children of the returned ref.
 *
 * Works for both:
 * - Elements present at mount time
 * - Elements added later (async data) via MutationObserver
 * - Elements already in viewport when they render (rAF trick)
 *
 * Returns [ref, forceCheck] where forceCheck() can be called after
 * setState to immediately re-scan for new .reveal elements.
 */
export function useScrollReveal() {
  const ref     = useRef(null)
  const ioRef   = useRef(null)

  const observeAll = useCallback(() => {
    const container = ref.current
    const io        = ioRef.current
    if (!container || !io) return

    container.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
      const rect = el.getBoundingClientRect()
      // If already visible in viewport, show it with a tiny rAF delay
      if (rect.top < window.innerHeight + 60 && rect.bottom > 0) {
        requestAnimationFrame(() =>
          requestAnimationFrame(() => el.classList.add('visible'))
        )
      } else {
        io.observe(el)
      }
    })
  }, [])

  useEffect(() => {
    const container = ref.current
    if (!container) return

    // Create IO once
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.06, rootMargin: '0px 0px -20px 0px' }
    )
    ioRef.current = io

    // Initial scan
    observeAll()

    // Watch for newly added nodes (after async data renders)
    const mo = new MutationObserver(observeAll)
    mo.observe(container, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
      ioRef.current = null
    }
  }, [observeAll])

  return [ref, observeAll]
}
