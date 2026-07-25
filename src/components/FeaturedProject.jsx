import { useState, useEffect, useRef } from 'react'
import { getProjects } from '../lib/data'

const STATUS_STYLE = {
  done:        { backgroundColor: 'var(--status-done)',        color: 'var(--text-primary)' },
  in_progress: { backgroundColor: 'var(--status-progress-bg)', color: 'var(--status-progress-color)', border: '1px solid var(--status-progress-border)' },
  paused:      { backgroundColor: 'var(--surface)',            color: 'var(--text-secondary)' },
}

const STATUS_LABEL = {
  done:        'done',
  in_progress: 'in progress',
  paused:      'paused',
}

function Pill({ children, style }) {
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.62rem',
        letterSpacing: '0.03em',
        padding: '0.18rem 0.6rem',
        borderRadius: '9999px',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  )
}

export default function FeaturedProject() {
  const [project, setProject] = useState(null)
  const ref                   = useRef(null)

  useEffect(() => {
    getProjects().then((projects) => {
      const sorted = [...projects].sort((a, b) => a.display_order - b.display_order)
      setProject(sorted.find((p) => p.featured) ?? sorted[0] ?? null)
    })
  }, [])

  useEffect(() => {
    const container = ref.current
    if (!container) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            container.querySelectorAll('.f-reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('f-visible'), i * 80)
            })
            io.disconnect()
          }
        })
      },
      { threshold: 0.05 }
    )
    io.observe(container)
    return () => io.disconnect()
  }, [project])

  if (!project) return null

  return (
    <div ref={ref} className="px-6" style={{ paddingBottom: '0.5rem', paddingTop: '1.5rem' }}>
      <style>{`
        .f-reveal { opacity:0; transform:translateY(20px);
          transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1); }
        .f-reveal.f-visible { opacity:1; transform:translateY(0); }
      `}</style>
      <div
        className="f-reveal card-hover"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          padding: '1.5rem 1.8rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle accent corner accent */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '120px',
            height: '120px',
            background: 'radial-gradient(ellipse at top right, rgba(184,134,11,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── Top row ─────────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.55rem',
            marginBottom: '0.9rem',
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.58rem',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--accent)',
              fontWeight: 500,
            }}
          >
            ★ featured
          </span>

          <span style={{ color: 'var(--border)', fontSize: '0.7rem' }}>·</span>

          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.2,
            }}
          >
            {project.title}
          </span>

          {project.type === 'team' && (
            <Pill style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-secondary)' }}>
              team
            </Pill>
          )}

          <Pill style={STATUS_STYLE[project.status] ?? STATUS_STYLE.done}>
            {STATUS_LABEL[project.status] ?? project.status}
          </Pill>
        </div>

        {/* ── Tradeoff callout ─────────────────────────────────────────── */}
        {project.why_tradeoff && (
          <div
            style={{
              borderLeft: '3px solid var(--accent-border)',
              backgroundColor: 'var(--surface-2)',
              borderRadius: '0 8px 8px 0',
              padding: '0.75rem 1rem',
              marginBottom: '1.1rem',
            }}
          >
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.58rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--accent)',
                marginBottom: '0.35rem',
              }}
            >
              ↳ tradeoff
            </p>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '0.9rem',
                fontStyle: 'italic',
                color: 'var(--text-primary)',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {project.why_tradeoff}
            </p>
          </div>
        )}

        {/* ── Footer link ──────────────────────────────────────────────── */}
        <a
          href="#projects"
          className="accent-link"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.72rem',
          }}
        >
          View all projects →
        </a>
      </div>
    </div>
  )
}
