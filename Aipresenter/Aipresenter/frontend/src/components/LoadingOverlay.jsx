import '../styles/LoadingOverlay.css'

function LoadingOverlay({ message }) {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="loading-spinner-large">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <span className="spinner-icon">🎬</span>
        </div>
        <h2 className="loading-title">Creating Your Presentation</h2>
        <p className="loading-message">{message || 'Please wait...'}</p>
        <div className="loading-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
        <p className="loading-hint">This may take a few minutes</p>
      </div>
    </div>
  )
}

export default LoadingOverlay
