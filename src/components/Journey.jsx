import { useState, useEffect, useRef } from 'react'
import { getJourneyLog } from '../lib/data'

const STATUS_STYLE = {
  done:        { backgroundColor: 'var(--status-done)',        color: 'var(--text-primary)' },
  in_progress: { backgroundColor: 'var(--status-progress-bg)', color: 'var(--status-progress-color)', border: '1px solid var(--status-progress-border)' },
  paused:      { backgroundColor: 'var(--surface)',            color: 'var(--text-secondary)' },
}
const STATUS_LABEL = { done: 'done', in_progress: 'in progress', paused: 'paused' }

export default function Journey() {
  const [entries, setEntries] = useState([])
  const ref = useRef(null)

  useEffect(() => {
    getJourneyLog().then((data) =>
      setEntries([...data].sort((a, b) => a.display_order - b.display_order))
    )
  }, [])

  useEffect(() => {
    const container = ref.current
    if (!container) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            container.querySelectorAll('.j-reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('j-visible'), i * 75)
            })
            io.disconnect()
          }
        })
      },
      { threshold: 0.04 }
    )
    io.observe(container)
    return () => io.disconnect()
  }, [entries.length])

  return (
    <div ref={ref} style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }} className="px-6">
      <style>{`
        .j-reveal { opacity:0; transform:translateY(20px);
          transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1),
                      transform 0.6s cubic-bezier(0.22,1,0.36,1); }
        .j-reveal.j-visible { opacity:1; transform:translateY(0); }
      `}</style>

      <p className="section-label j-reveal">Journey Log</p>

      {entries.length === 0 && (
        <p className="j-reveal" style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem',
          color: 'var(--text-muted)', fontStyle: 'italic',
        }}>
          No journey entries yet — add some in Supabase.
        </p>
      )}

      <div>
        {entries.map((entry, i) => {
          const isActive = entry.status === 'in_progress'
          return (
            <div key={entry.id} className="j-reveal" style={{ display: 'flex', gap: '1.4rem' }}>
              {/* Date */}
              <div style={{ width: '5.5rem', flexShrink: 0, paddingTop: '0.12rem' }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '0.67rem',
                  color: 'var(--text-secondary)', letterSpacing: '0.02em', whiteSpace: 'nowrap',
                }}>
                  {entry.entry_date}
                </span>
              </div>

              {/* Dot + connector */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div
                  className={isActive ? 'timeline-dot-active' : ''}
                  style={{
                    width: '9px', height: '9px', borderRadius: '50%',
                    backgroundColor: isActive ? undefined : 'var(--text-muted)',
                    flexShrink: 0, marginTop: '0.18rem',
                    transition: 'background-color 0.3s ease',
                  }}
                />
                {i < entries.length - 1 && (
                  <div style={{
                    width: '1px', flexGrow: 1,
                    background: isActive
                      ? 'linear-gradient(to bottom, var(--accent-border), var(--border))'
                      : 'var(--border)',
                    marginTop: '6px', minHeight: '1.5rem',
                  }} />
                )}
              </div>

              {/* Content */}
              <div style={{ paddingBottom: '2rem', flex: 1 }}>
                <span style={{
                  display: 'inline-block',
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem',
                  letterSpacing: '0.04em', padding: '0.12rem 0.55rem',
                  borderRadius: '9999px', marginBottom: '0.45rem',
                  ...(STATUS_STYLE[entry.status] ?? STATUS_STYLE.done),
                }}>
                  {STATUS_LABEL[entry.status] ?? entry.status}
                </span>
                <p style={{
                  fontFamily: "'Playfair Display', serif", fontSize: '0.94rem',
                  color: 'var(--text-primary)', lineHeight: 1.7, margin: 0,
                }}>
                  {entry.entry}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
