import { useState, useEffect } from 'react'
import { getProfile } from '../lib/data'

const NAV_LINKS = [
  { label: 'Toolkit',  href: '#toolkit'  },
  { label: 'Projects', href: '#projects' },
  { label: 'Journey',  href: '#journey'  },
  { label: 'Connect',  href: '#connect'  },
]

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1"  x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function ArrowUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5"/>
      <polyline points="5 12 12 5 19 12"/>
    </svg>
  )
}

export default function Nav() {
  const [name, setName]            = useState('')
  const [scrollPct, setScrollPct]  = useState(0)
  const [activeSection, setActive] = useState('')
  const [scrolled, setScrolled]    = useState(false)
  const [showTop, setShowTop]      = useState(false)
  const [dark, setDark]            = useState(
    () => localStorage.getItem('theme') === 'dark'
  )

  // Apply / remove dark class on html
  useEffect(() => {
    const html = document.documentElement
    if (dark) {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  useEffect(() => {
    getProfile().then((p) => setName(p?.name ?? ''))
  }, [])

  useEffect(() => {
    const sections = NAV_LINKS.map(({ href }) =>
      document.querySelector(href)
    ).filter(Boolean)

    function onScroll() {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      setScrollPct(max > 0 ? (window.scrollY / max) * 100 : 0)
      setScrolled(window.scrollY > 20)
      setShowTop(window.scrollY > 400)

      let current = ''
      sections.forEach((sec) => {
        if (window.scrollY >= sec.offsetTop - 120) current = `#${sec.id}`
      })
      setActive(current)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Scroll progress bar */}
      <div className="progress-bar" style={{ width: `${scrollPct}%` }} aria-hidden="true" />

      {/* Nav */}
      <nav
        style={{
          position: 'sticky', top: 0, zIndex: 50,
          padding: '0 2rem', height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backgroundColor: scrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
          transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease',
        }}
      >
        {/* Logo */}
        <div style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 600,
          fontSize: '1.1rem', color: 'var(--text-primary)', letterSpacing: '-0.01em',
        }}>
          {name || '\u00A0'}
        </div>

        {/* Right: links + dark toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {NAV_LINKS.map(({ label, href }) => (
            <a key={href} href={href}
              className={`nav-link ${activeSection === href ? 'active' : ''}`}
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', letterSpacing: '0.03em' }}
            >
              {label}
            </a>
          ))}

          {/* Dark mode toggle */}
          <button
            className="dark-toggle"
            onClick={() => setDark((d) => !d)}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={dark ? 'Light mode' : 'Dark mode'}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </nav>

      {/* Scroll-to-top button */}
      <button
        className={`scroll-top-btn ${showTop ? '' : 'hidden'}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
        title="Back to top"
      >
        <ArrowUpIcon />
      </button>
    </>
  )
}
