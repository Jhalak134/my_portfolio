import { useState, useEffect, useRef } from 'react'
import { getProjects, getProjectSkills, getSkills } from '../lib/data'

const STATUS_STYLE = {
  done:        { backgroundColor: 'var(--status-done)',              color: 'var(--text-primary)' },
  in_progress: { backgroundColor: 'var(--status-progress-bg)',       color: 'var(--status-progress-color)', border: '1px solid var(--status-progress-border)' },
  paused:      { backgroundColor: 'var(--surface)',                  color: 'var(--text-secondary)' },
}
const STATUS_LABEL = { done: 'done', in_progress: 'in progress', paused: 'paused' }

function Pill({ children, style }) {
  return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem',
      letterSpacing: '0.03em', padding: '0.18rem 0.6rem',
      borderRadius: '9999px', whiteSpace: 'nowrap', ...style,
    }}>
      {children}
    </span>
  )
}

function StackChip({ name }) {
  return (
    <span className="chip-hover" style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem',
      backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)',
      borderRadius: '5px', padding: '0.22rem 0.55rem',
      color: 'var(--text-secondary)', cursor: 'default',
    }}>
      {name}
    </span>
  )
}

function useRevealSection(deps = []) {
  const ref = useRef(null)
  useEffect(() => {
    const container = ref.current
    if (!container) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            container.querySelectorAll('.s-reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('s-visible'), i * 70)
            })
            io.disconnect()
          }
        })
      },
      { threshold: 0.04 }
    )
    io.observe(container)
    return () => io.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return ref
}

export default function Projects() {
  const [projects, setProjects]           = useState([])
  const [skillMap, setSkillMap]           = useState({})
  const [projectSkills, setProjectSkills] = useState([])
  const ref = useRevealSection([projects.length])

  useEffect(() => {
    Promise.all([getProjects(), getProjectSkills(), getSkills()]).then(
      ([proj, pSkills, skills]) => {
        setProjects([...proj].sort((a, b) => a.display_order - b.display_order))
        setProjectSkills(pSkills)
        setSkillMap(Object.fromEntries(skills.map((s) => [s.id, s.name])))
      }
    )
  }, [])

  function getStack(projectId) {
    return projectSkills
      .filter((ps) => ps.project_id === projectId)
      .map((ps) => skillMap[ps.skill_id])
      .filter(Boolean)
  }

  return (
    <div ref={ref} style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }} className="px-6">
      <style>{`
        .s-reveal { opacity:0; transform:translateY(24px);
          transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1),
                      transform 0.6s cubic-bezier(0.22,1,0.36,1); }
        .s-reveal.s-visible { opacity:1; transform:translateY(0); }
      `}</style>

      <p className="section-label s-reveal">Projects</p>

      {projects.length === 0 && (
        <p className="s-reveal" style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem',
          color: 'var(--text-muted)', fontStyle: 'italic',
        }}>
          No projects yet — add some in Supabase.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {projects.map((project) => {
          const stack = getStack(project.id)
          return (
            <div key={project.id} className="s-reveal card-hover" style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px', padding: '1.4rem 1.6rem',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Corner glow */}
              <div aria-hidden="true" style={{
                position: 'absolute', top: 0, right: 0,
                width: '100px', height: '100px',
                background: 'var(--card-glow)', pointerEvents: 'none',
              }} />

              {/* Title + badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif", fontSize: '1.1rem',
                  fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2,
                }}>
                  {project.title}
                </h2>
                {project.type === 'team' && (
                  <Pill style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-secondary)' }}>team</Pill>
                )}
                <Pill style={STATUS_STYLE[project.status] ?? STATUS_STYLE.done}>
                  {STATUS_LABEL[project.status] ?? project.status}
                </Pill>
              </div>

              {/* Description line if available */}
              {project.description && (
                <p style={{
                  fontFamily: "'Inter', sans-serif", fontSize: '0.85rem',
                  color: 'var(--text-secondary)', lineHeight: 1.6,
                  marginBottom: '0.75rem', fontWeight: 300,
                }}>
                  {project.description}
                </p>
              )}

              {/* Stack chips */}
              {stack.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.9rem' }}>
                  {stack.map((name) => <StackChip key={name} name={name} />)}
                </div>
              )}

              {/* Tradeoff */}
              {project.why_tradeoff && (
                <div style={{
                  borderLeft: '3px solid var(--accent-border)',
                  backgroundColor: 'var(--surface-2)',
                  borderRadius: '0 8px 8px 0', padding: '0.7rem 0.9rem',
                  marginBottom: project.live_url || project.code_url ? '1rem' : '0',
                }}>
                  <p style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem',
                    textTransform: 'uppercase', letterSpacing: '0.12em',
                    color: 'var(--accent)', marginBottom: '0.35rem',
                  }}>
                    ↳ tradeoff
                  </p>
                  <p style={{
                    fontFamily: "'Playfair Display', serif", fontSize: '0.9rem',
                    fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.65, margin: 0,
                  }}>
                    {project.why_tradeoff}
                  </p>
                </div>
              )}

              {/* Links */}
              {(project.live_url || project.code_url) && (
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: project.why_tradeoff ? '0' : '0' }}>
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noreferrer"
                      className="accent-link" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.73rem' }}>
                      live ↗
                    </a>
                  )}
                  {project.code_url && (
                    <a href={project.code_url} target="_blank" rel="noreferrer"
                      className="accent-link" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.73rem' }}>
                      code ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
