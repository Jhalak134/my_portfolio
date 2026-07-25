import { useState, useEffect, useRef } from 'react'
import { getProfile, getProjects, getSkills } from '../lib/data'

// ── Typing effect ─────────────────────────────────────────────────────────────
const PHRASES = [
  'Full-Stack Developer',
  'BTech CSE \u201929',
  'App Developer',
  'DSA Learner',
  'Open Source Explorer',
]

function useTypingEffect(phrases, speed = 75, pause = 1800) {
  const [displayed, setDisplayed] = useState('')
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [deleting,  setDeleting]  = useState(false)

  useEffect(() => {
    const phrase = phrases[phraseIdx % phrases.length]
    let timeout

    if (!deleting && displayed === phrase) {
      timeout = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && displayed === '') {
      setDeleting(false)
      setPhraseIdx((i) => (i + 1) % phrases.length)
    } else if (deleting) {
      timeout = setTimeout(() => setDisplayed((d) => d.slice(0, -1)), speed / 2)
    } else {
      timeout = setTimeout(
        () => setDisplayed(phrase.slice(0, displayed.length + 1)), speed
      )
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, phraseIdx, phrases, speed, pause])

  return displayed
}

function getInitials(name = '') {
  return name.split(' ').map((w) => w[0] ?? '').slice(0, 2).join('').toUpperCase()
}

// ── Animated counter hook ─────────────────────────────────────────────────────
function useCountUp(target, duration = 1200, startOnVisible = true) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    if (!startOnVisible) return

    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const steps = 40
        const increment = target / steps
        let current = 0
        const interval = setInterval(() => {
          current += increment
          if (current >= target) {
            setCount(target)
            clearInterval(interval)
          } else {
            setCount(Math.floor(current))
          }
        }, duration / steps)
        io.disconnect()
      }
    }, { threshold: 0.5 })

    io.observe(el)
    return () => io.disconnect()
  }, [target, duration, startOnVisible])

  return [count, ref]
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ value, label, suffix = '' }) {
  const [count, ref] = useCountUp(value)

  return (
    <div ref={ref} className="stat-card">
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.8rem', fontWeight: 700,
        color: 'var(--accent)', lineHeight: 1,
        marginBottom: '0.3rem',
      }}>
        {count}{suffix}
      </div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.6rem', textTransform: 'uppercase',
        letterSpacing: '0.1em', color: 'var(--text-secondary)',
      }}>
        {label}
      </div>
    </div>
  )
}

export default function Hero() {
  const [profile, setProfile]   = useState(null)
  const [mounted, setMounted]   = useState(false)
  const [projectCount, setPC]   = useState(0)
  const [skillCount,   setSC]   = useState(0)
  const typed = useTypingEffect(PHRASES)

  useEffect(() => {
    Promise.all([getProfile(), getProjects(), getSkills()]).then(
      ([p, projects, skills]) => {
        setProfile(p)
        setPC(projects.length)
        setSC(skills.length)
        requestAnimationFrame(() => setMounted(true))
      }
    )
  }, [])

  if (!profile) return null

  const initials = getInitials(profile.name)

  const fadeUp = (delay) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(18px)',
    transition: `opacity 0.65s ease ${delay}s, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
  })

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center',
      padding: '3.5rem 2rem 3rem',
      position: 'relative',
    }}>
      {/* Ambient glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: '500px', height: '400px',
        background: 'radial-gradient(ellipse, var(--accent-glow) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Avatar */}
      <div className="avatar-ring" style={{
        ...fadeUp(0.05),
        marginBottom: '1.4rem',
        width: '70px', height: '70px', borderRadius: '50%',
        border: '2px solid var(--accent-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'var(--surface)',
        position: 'relative', zIndex: 1,
      }}>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.4rem', fontWeight: 600, color: 'var(--accent)',
        }}>
          {initials}
        </span>
      </div>

      {/* Name */}
      <h1 style={{
        ...fadeUp(0.15),
        fontFamily: "'Playfair Display', serif",
        color: 'var(--text-primary)',
        fontSize: 'clamp(2.4rem, 6vw, 3.8rem)',
        fontWeight: 700, lineHeight: 1.08,
        letterSpacing: '-0.025em', marginBottom: '0.9rem',
        position: 'relative', zIndex: 1,
      }}>
        {profile.name}
      </h1>

      {/* Typing */}
      <div style={{
        ...fadeUp(0.25),
        fontFamily: "'JetBrains Mono', monospace",
        color: 'var(--accent)',
        fontSize: 'clamp(0.78rem, 1.8vw, 0.92rem)',
        letterSpacing: '0.02em', marginBottom: '1rem',
        minHeight: '1.6em',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', zIndex: 1,
      }}>
        <span>{typed}</span>
        <span className="cursor" aria-hidden="true" />
      </div>

      {/* Bio */}
      {profile.identity_line && profile.identity_line.length > 2 && (
        <p style={{
          ...fadeUp(0.35),
          fontFamily: "'Inter', sans-serif",
          color: 'var(--text-secondary)',
          fontSize: 'clamp(0.8rem, 1.6vw, 0.9rem)',
          maxWidth: '400px', lineHeight: 1.75,
          marginBottom: '1.2rem', fontWeight: 300,
          position: 'relative', zIndex: 1,
        }}>
          {profile.identity_line}
        </p>
      )}

      {/* Quick chips */}
      <div style={{
        ...fadeUp(0.42),
        display: 'flex', gap: '0.5rem', flexWrap: 'wrap',
        justifyContent: 'center', marginBottom: '1.4rem',
        position: 'relative', zIndex: 1,
      }}>
        {[
          { icon: '🎓', label: "CSE '29" },
          { icon: '💻', label: 'App Dev' },
          { icon: '📚', label: 'DSA + Java' },
        ].map(({ icon, label }) => (
          <span key={label} style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '9999px',
            padding: '0.25rem 0.7rem',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.68rem', color: 'var(--text-secondary)',
          }}>
            <span>{icon}</span><span>{label}</span>
          </span>
        ))}
      </div>

      {/* Status badge */}
      <div style={{ ...fadeUp(0.48), position: 'relative', zIndex: 1, marginBottom: '2.2rem' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          backgroundColor: 'var(--accent-bg)',
          border: '1px solid var(--accent-border)',
          color: 'var(--accent)',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.7rem', letterSpacing: '0.04em',
          padding: '0.35rem 1rem', borderRadius: '9999px',
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            backgroundColor: '#6BBF72',
            boxShadow: '0 0 6px rgba(107,191,114,0.7)',
            display: 'inline-block', flexShrink: 0,
          }} />
          {profile.status}
        </span>
      </div>

      {/* ── Animated stat counters ─────────────────────────────────── */}
      {(projectCount > 0 || skillCount > 0) && (
        <div style={{
          ...fadeUp(0.55),
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
          width: '100%', maxWidth: '340px',
          position: 'relative', zIndex: 1,
          marginBottom: '0.5rem',
        }}>
          <StatCard value={projectCount} label="Projects" />
          <StatCard value={skillCount}   label="Skills" />
          <StatCard value={1}            label="Year in" suffix="st" />
        </div>
      )}

      {/* Scroll hint */}
      <div style={{
        marginTop: '2rem',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
        opacity: mounted ? 0.4 : 0, transition: 'opacity 1s ease 1.1s',
        position: 'relative', zIndex: 1,
      }} aria-hidden="true">
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '0.52rem',
          letterSpacing: '0.14em', color: 'var(--text-secondary)', textTransform: 'uppercase',
        }}>scroll</span>
        <svg width="12" height="18" viewBox="0 0 14 20" fill="none">
          <rect x="1" y="1" width="12" height="18" rx="6" stroke="var(--border)" strokeWidth="1.2"/>
          <circle cx="7" cy="6" r="2" fill="var(--text-muted)">
            <animateTransform attributeName="transform" type="translate"
              values="0,0; 0,5; 0,0" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </div>
  )
}
