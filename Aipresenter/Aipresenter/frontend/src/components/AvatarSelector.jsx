import { useState } from 'react'
import '../styles/AvatarSelector.css'

function AvatarSelector({ 
  avatarType, 
  onAvatarChange, 
  uploadedImage, 
  onImageUpload, 
  onClearImage,
  fileInputRef,
  disabled 
}) {
  const [imagePreview, setImagePreview] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onImageUpload(e)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClear = () => {
    onClearImage()
    setImagePreview(null)
  }

  return (
    <div className="avatar-selector-container">
      <label className="input-label">
        <span className="label-icon">👤</span>
        Choose Your Avatar
      </label>

      <div className="avatar-options">
        {/* Default Avatar Selection */}
        <div className="default-avatars">
          <button
            type="button"
            className={`avatar-button ${avatarType === 'male' && !uploadedImage ? 'active' : ''}`}
            onClick={() => {
              onAvatarChange('male')
              handleClear()
            }}
            disabled={disabled}
          >
            <div className="avatar-preview male-avatar">
              <span className="avatar-icon">👨</span>
            </div>
            <span className="avatar-label">Male Avatar</span>
          </button>

          <button
            type="button"
            className={`avatar-button ${avatarType === 'female' && !uploadedImage ? 'active' : ''}`}
            onClick={() => {
              onAvatarChange('female')
              handleClear()
            }}
            disabled={disabled}
          >
            <div className="avatar-preview female-avatar">
              <span className="avatar-icon">👩</span>
            </div>
            <span className="avatar-label">Female Avatar</span>
          </button>
        </div>

        {/* Divider */}
        <div className="divider">
          <span>OR</span>
        </div>

        {/* Custom Image Upload */}
        <div className="custom-upload">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="file-input"
            id="avatar-upload"
            disabled={disabled}
          />
          
          {uploadedImage && imagePreview ? (
            <div className="uploaded-preview">
              <img src={imagePreview} alt="Uploaded avatar" />
              <button 
                type="button" 
                className="clear-upload-btn"
                onClick={handleClear}
                disabled={disabled}
              >
                ✕
              </button>
              <span className="upload-name">{uploadedImage.name}</span>
            </div>
          ) : (
            <label htmlFor="avatar-upload" className={`upload-label ${disabled ? 'disabled' : ''}`}>
              <span className="upload-icon">📤</span>
              <span className="upload-text">Upload Your Image</span>
              <span className="upload-hint">JPG, PNG, WebP (max 10MB)</span>
            </label>
          )}
        </div>

        {/* Voice Selection for Custom Upload */}
        {uploadedImage && (
          <div className="voice-selection">
            <label className="voice-label">Select voice for your avatar:</label>
            <div className="voice-buttons">
              <button
                type="button"
                className={`voice-btn ${avatarType === 'male' ? 'active' : ''}`}
                onClick={() => onAvatarChange('male')}
                disabled={disabled}
              >
                🎙️ Male Voice
              </button>
              <button
                type="button"
                className={`voice-btn ${avatarType === 'female' ? 'active' : ''}`}
                onClick={() => onAvatarChange('female')}
                disabled={disabled}
              >
                🎙️ Female Voice
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AvatarSelector
