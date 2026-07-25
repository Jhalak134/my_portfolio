import { useState, useEffect, useRef } from 'react'
import { getProfile } from '../lib/data'

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  )
}
function LinkedinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}
function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

const LINK_CONFIG = [
  { label: 'GitHub',   icon: <GithubIcon />,   key: 'github_url',   isEmail: false },
  { label: 'LinkedIn', icon: <LinkedinIcon />, key: 'linkedin_url', isEmail: false },
  { label: 'Email',    icon: <MailIcon />,     key: 'email',        isEmail: true  },
]

// Extract GitHub username from URL
function getGithubUsername(url = '') {
  const match = url.match(/github\.com\/([^/]+)/)
  return match ? match[1] : null
}

// GitHub API stats card
function GithubStatsCard({ username }) {
  const [stats, setStats] = useState(null)
  const [langs, setLangs] = useState([])
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!username) return
    // Fetch user stats
    fetch(`https://api.github.com/users/${username}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.login) setStats(data)
        else setError(true)
      })
      .catch(() => setError(true))

    // Fetch top repos to compute languages
    fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=10`)
      .then((r) => r.json())
      .then((repos) => {
        if (!Array.isArray(repos)) return
        const langCount = {}
        repos.forEach((repo) => {
          if (repo.language) langCount[repo.language] = (langCount[repo.language] ?? 0) + 1
        })
        const sorted = Object.entries(langCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([lang]) => lang)
        setLangs(sorted)
      })
      .catch(() => {})
  }, [username])

  if (!username || error) return null
  if (!stats) return (
    <div style={{
      marginBottom: '2rem', padding: '1rem 1.25rem',
      backgroundColor: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: '12px', height: '100px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: 'var(--text-muted)' }}>
        loading github…
      </span>
    </div>
  )

  const statItems = [
    { label: 'Repos',      value: stats.public_repos ?? 0 },
    { label: 'Followers',  value: stats.followers     ?? 0 },
    { label: 'Following',  value: stats.following     ?? 0 },
  ]

  return (
    <div style={{
      marginBottom: '2rem', padding: '1rem 1.25rem',
      backgroundColor: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: '12px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.62rem', textTransform: 'uppercase',
          letterSpacing: '0.1em', color: 'var(--accent)',
          display: 'flex', alignItems: 'center', gap: '0.45rem',
          margin: 0,
        }}>
          <GithubIcon /> GitHub Activity
        </p>
        <a href={stats.html_url} target="_blank" rel="noreferrer" style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem',
          color: 'var(--text-muted)', textDecoration: 'none',
        }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          @{username} ↗
        </a>
      </div>

      {/* Stat numbers */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: langs.length ? '1rem' : '0' }}>
        {statItems.map(({ label, value }) => (
          <div key={label} style={{
            flex: 1, textAlign: 'center',
            backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-subtle)',
            borderRadius: '8px', padding: '0.6rem 0.5rem',
          }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.4rem', fontWeight: 700,
              color: 'var(--accent)', lineHeight: 1, marginBottom: '0.25rem',
            }}>
              {value}
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.58rem', textTransform: 'uppercase',
              letterSpacing: '0.08em', color: 'var(--text-secondary)',
            }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Top languages */}
      {langs.length > 0 && (
        <div>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.58rem', textTransform: 'uppercase',
            letterSpacing: '0.1em', color: 'var(--text-secondary)',
            marginBottom: '0.5rem',
          }}>
            Top languages
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {langs.map((lang) => (
              <span key={lang} style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem',
                backgroundColor: 'var(--accent-bg)', border: '1px solid var(--accent-border)',
                color: 'var(--accent)', borderRadius: '6px', padding: '0.2rem 0.55rem',
              }}>
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Connect() {
  const [profile, setProfile] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    getProfile().then(setProfile)
  }, [])

  useEffect(() => {
    const container = ref.current
    if (!container) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            container.querySelectorAll('.c-reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('c-visible'), i * 80)
            })
            io.disconnect()
          }
        })
      },
      { threshold: 0.05 }
    )
    io.observe(container)
    return () => io.disconnect()
  }, [profile])

  const githubUsername = getGithubUsername(profile?.github_url)

  return (
    <div ref={ref} style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }} className="px-6">
      <style>{`
        .c-reveal {
          opacity: 0; transform: translateY(22px);
          transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1),
                      transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .c-reveal.c-visible { opacity: 1; transform: translateY(0); }
        .social-row {
          display: inline-flex; align-items: center; gap: 0.85rem;
          text-decoration: none;
          padding: 0.7rem 1rem; border-radius: 12px;
          border: 1px solid transparent; width: 100%;
          transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }
        .social-row:hover {
          background-color: var(--accent-bg);
          border-color: var(--accent-border);
          transform: translateX(4px);
        }
      `}</style>

      {/* Section label */}
      <p className="section-label c-reveal">Connect</p>

      {/* Currently note */}
      {profile?.currently_note && (
        <p className="c-reveal" style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.05rem', fontStyle: 'italic',
          color: 'var(--text-primary)', lineHeight: 1.8,
          marginBottom: '2rem', maxWidth: '38rem',
        }}>
          {profile.currently_note}
        </p>
      )}

      {/* Open to chips */}
      {profile?.open_to?.length > 0 && (
        <div className="c-reveal" style={{ marginBottom: '2rem' }}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.64rem', textTransform: 'uppercase',
            letterSpacing: '0.12em', color: 'var(--text-secondary)', marginBottom: '0.75rem',
          }}>
            Open to
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {profile.open_to.map((item) => (
              <span key={item} className="chip-hover" style={{
                display: 'inline-block',
                backgroundColor: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '0.32rem 0.75rem',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.74rem', color: 'var(--text-primary)', cursor: 'default',
              }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* GitHub Stats */}
      {githubUsername && (
        <div className="c-reveal">
          <GithubStatsCard username={githubUsername} />
        </div>
      )}

      {/* Social links */}
      <div className="c-reveal" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginLeft: '-1rem' }}>
        {LINK_CONFIG.map(({ label, icon, key, isEmail }) => {
          const raw = profile?.[key]
          if (!raw) return null
          const href    = isEmail ? `mailto:${raw}` : raw
          const display = isEmail ? raw : raw.replace('https://', '')

          return (
            <a key={label} href={href}
              target={!isEmail ? '_blank' : undefined}
              rel={!isEmail ? 'noreferrer' : undefined}
              className="social-row"
            >
              <span style={{ color: 'var(--accent)', flexShrink: 0 }}>{icon}</span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.74rem', color: 'var(--text-secondary)',
                minWidth: '4.8rem', letterSpacing: '0.01em',
              }}>
                {label.toLowerCase()}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>→</span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.78rem', color: 'var(--text-primary)',
                borderBottom: '1px solid var(--border)', paddingBottom: '1px',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {display}
              </span>
            </a>
          )
        })}
      </div>

      {/* Footer */}
      <p className="c-reveal" style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.58rem', color: 'var(--text-muted)',
        letterSpacing: '0.1em', marginTop: '3.5rem',
        textAlign: 'center', textTransform: 'uppercase',
      }}>
        built with React · Supabase · {new Date().getFullYear()}
      </p>
    </div>
  )
}
