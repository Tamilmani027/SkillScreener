import React from 'react'

export default function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden>
      <div className="mockup">
        <div className="mockup-screen">
          <div className="mockup-blob" />
          <div className="mockup-line" />
          <div className="mockup-line short" />
          <div className="mockup-pill" />
        </div>
      </div>
      <div className="visual-note">
        <strong>Instant resume insights</strong>
        <span>Score, matched skills, and gaps—fast and precise.</span>
      </div>
    </div>
  )
}
