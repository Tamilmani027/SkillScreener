import React from 'react'

function Header() {
  return (
    <>
    <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">0</div>
          <div>
            <div className="brand-name">to shipped</div>
            <div className="brand-subtitle">resume parser</div>
          </div>
        </div>

        <nav className="nav">
          <a href="#about">About</a>
          <a href="#results">Results</a>
          <a href="#skills">Skills</a>
        </nav>
      </header>
      </>
  )
}

export default Header
