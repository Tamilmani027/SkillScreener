import React from 'react'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-left">
          <div className="brand-wrap small">
            <div className="brand-mark">0</div>
            <div>
              <div className="brand-name">to shipped</div>
              <div className="brand-subtitle">resume parser</div>
            </div>
          </div>
          <p className="muted">© {new Date().getFullYear()} To Shipped — Built with care.</p>
        </div>

        <div className="footer-links">
          <nav>
            <a href="#about">About</a>
            <a href="#results">Results</a>
            <a href="#skills">Skills</a>
            <a href="#">Privacy</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
