import { useState, useEffect, useRef } from 'react'
import { getSkills } from '../lib/data'

const CATEGORIES = [
  { key: 'core',          label: 'Core' },
  { key: 'building_with', label: 'Building With' },
  { key: 'tools',         label: 'Tools' },
]

const PILL_BASE = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '0.58rem',
  letterSpacing: '0.02em',
  padding: '0.05rem 0.4rem',
  borderRadius: '9999px',
  whiteSpace: 'nowrap',
  lineHeight: 1.5,
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function GitIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6"  cy="6"  r="2" />
      <circle cx="18" cy="6"  r="2" />
      <circle cx="6"  cy="18" r="2" />
      <path d="M6 8v8" />
      <path d="M18 8c0 4-6 6-6 6H8" />
    </svg>
  )
}

function VSCodeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8  6  2  12  8 18" />
    </svg>
  )
}

function FigmaIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5"  y="2"  width="7" height="7" rx="1" />
      <rect x="12" y="2"  width="7" height="7" rx="1" />
      <rect x="5"  y="9"  width="7" height="7" rx="1" />
      <rect x="5"  y="16" width="7" height="7" rx="1" />
      <circle cx="15.5" cy="12.5" r="3.5" />
    </svg>
  )
}

const TOOL_ICONS = {
  Git:       <GitIcon />,
  'VS Code': <VSCodeIcon />,
  Figma:     <FigmaIcon />,
}

// ─── SkillChip ────────────────────────────────────────────────────────────────
function SkillChip({ name, inProgress }) {
  return (
    <span className="chip-hover" style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
      backgroundColor: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: '8px', padding: '0.35rem 0.75rem',
      fontFamily: "'JetBrains Mono', monospace", fontSize: '0.76rem',
      color: 'var(--text-primary)', letterSpacing: '0.01em', cursor: 'default',
    }}>
      {name}
      {inProgress && (
        <span style={{
          ...PILL_BASE,
          backgroundColor: 'var(--status-progress-bg)',
          color: 'var(--status-progress-color)',
          border: '1px solid var(--status-progress-border)',
        }}>
          learning
        </span>
      )}
    </span>
  )
}

// ─── ToolRow ──────────────────────────────────────────────────────────────────
function ToolRow({ name, usage }) {
  const isDailyUsage = usage === 'daily'
  return (
    <span className="chip-hover" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: '0.5rem', width: '100%',
      backgroundColor: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: '8px', padding: '0.38rem 0.75rem', cursor: 'default',
    }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-secondary)', flexShrink: 0 }}>
        {TOOL_ICONS[name] ?? null}
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.76rem', color: 'var(--text-primary)', letterSpacing: '0.01em' }}>
          {name}
        </span>
      </span>
      {usage && (
        <span style={{
          ...PILL_BASE,
          backgroundColor: isDailyUsage ? 'var(--status-done)' : 'var(--status-progress-bg)',
          color: isDailyUsage ? 'var(--text-primary)' : 'var(--status-progress-color)',
        }}>
          {usage}
        </span>
      )}
    </span>
  )
}

// ─── Toolkit section ──────────────────────────────────────────────────────────
export default function Toolkit() {
  const [skills, setSkills]   = useState([])
  const ref                   = useRef(null)

  useEffect(() => {
    getSkills().then(setSkills)
  }, [])

  // Self-contained IO — re-attaches after skills load
  useEffect(() => {
    const container = ref.current
    if (!container) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            container.querySelectorAll('.t-reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('t-visible'), i * 80)
            })
            io.disconnect()
          }
        })
      },
      { threshold: 0.04 }
    )
    io.observe(container)
    return () => io.disconnect()
  }, [skills.length])

  const grouped = Object.fromEntries(
    CATEGORIES.map(({ key }) => [
      key,
      skills
        .filter((s) => s.category === key)
        .sort((a, b) => a.display_order - b.display_order),
    ])
  )

  return (
    <div
      ref={ref}
      style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }}
      className="px-6"
    >
      <style>{`
        .t-reveal {
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1),
                      transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .t-reveal.t-visible { opacity: 1; transform: translateY(0); }
      `}</style>

      {/* Section heading */}
      <p className="section-label t-reveal">
        Tech Toolkit
      </p>

      {/* Three-column grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {CATEGORIES.map(({ key, label }) => (
          <div key={key} className="t-reveal">
            {/* Column label */}
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.66rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#7A736A',
                marginBottom: '1rem',
                fontWeight: 500,
              }}
            >
              {label}
            </p>

            {/* Chips / rows */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: key === 'tools' ? 'stretch' : 'flex-start',
                gap: '0.6rem',
              }}
            >
              {grouped[key]?.map((skill) =>
                key === 'tools' ? (
                  <ToolRow
                    key={skill.id}
                    name={skill.name}
                    usage={skill.usage}
                  />
                ) : (
                  <SkillChip
                    key={skill.id}
                    name={skill.name}
                    inProgress={skill.status === 'in_progress'}
                  />
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
