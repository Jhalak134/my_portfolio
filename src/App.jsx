import Nav from './components/Nav'
import Hero from './components/Hero'
import FeaturedProject from './components/FeaturedProject'
import Toolkit from './components/Toolkit'
import Projects from './components/Projects'
import Journey from './components/Journey'
import Connect from './components/Connect'

export default function App() {
  return (
    <>
      <Nav />

      {/* All content capped at 860px and centered */}
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <section id="hero">
          <Hero />
        </section>

        {/* Thin divider between hero and content */}
        <div style={{ height: '1px', backgroundColor: '#E8E2D8', margin: '0 1.5rem' }} />

        <FeaturedProject />

        <section id="toolkit">
          <Toolkit />
        </section>

        <div style={{ height: '1px', backgroundColor: '#E8E2D8', margin: '0 1.5rem' }} />

        <section id="projects">
          <Projects />
        </section>

        <div style={{ height: '1px', backgroundColor: '#E8E2D8', margin: '0 1.5rem' }} />

        <section id="journey">
          <Journey />
        </section>

        <div style={{ height: '1px', backgroundColor: '#E8E2D8', margin: '0 1.5rem' }} />

        <section id="connect">
          <Connect />
        </section>
      </div>
    </>
  )
}
