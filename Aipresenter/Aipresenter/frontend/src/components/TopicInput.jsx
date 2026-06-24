import '../styles/TopicInput.css'

function TopicInput({ value, onChange, disabled }) {
  return (
    <div className="topic-input-container">
      <label htmlFor="topic-input" className="input-label">
        <span className="label-icon">💡</span>
        Enter Your Topic
      </label>
      <div className="input-wrapper">
        <textarea
          id="topic-input"
          className="topic-textarea"
          placeholder="E.g., Explain quantum computing in simple terms..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={3}
          maxLength={500}
        />
        <span className="char-count">{value.length}/500</span>
      </div>
      <p className="input-hint">
        The AI will generate a 2-minute presentation script based on your topic
      </p>
    </div>
  )
}

export default TopicInput
