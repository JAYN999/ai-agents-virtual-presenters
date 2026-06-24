import '../styles/GenerateButton.css'

function GenerateButton({ onClick, disabled, isLoading }) {
  return (
    <button
      type="button"
      className={`generate-button ${isLoading ? 'loading' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {isLoading ? (
        <>
          <span className="spinner"></span>
          <span>Generating...</span>
        </>
      ) : (
        <>
          <span className="button-icon">✨</span>
          <span>Generate Presentation</span>
        </>
      )}
    </button>
  )
}

export default GenerateButton
