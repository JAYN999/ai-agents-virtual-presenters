import '../styles/Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">🎬</span>
          <h1>AI Presenter Generator</h1>
        </div>
        <p className="tagline">Transform any topic into an engaging AI-powered presentation</p>
      </div>
    </header>
  )
}

export default Header
