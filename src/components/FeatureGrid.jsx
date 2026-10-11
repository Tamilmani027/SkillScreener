import React from 'react'

const FEATURES = [
  {
    id: 1,
    title: 'Fast scoring',
    desc: 'Immediate objective score for any resume in seconds.'
  },
  {
    id: 2,
    title: 'Skill matching',
    desc: 'See which skills match the role and where to improve.'
  },
  {
    id: 3,
    title: 'Privacy-first',
    desc: 'Uploaded PDFs are processed locally in your browser.'
  },
  {
    id: 4,
    title: 'Actionable advice',
    desc: 'Clear, prioritized suggestions to improve fit.'
  }
]

export default function FeatureGrid() {
  return (
    <section className="features" aria-label="Product features">
      <div className="features-inner">
        {FEATURES.map((f) => (
          <article className="feature-card" key={f.id} tabIndex={0}>
            <div className="feature-icon" aria-hidden />
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
