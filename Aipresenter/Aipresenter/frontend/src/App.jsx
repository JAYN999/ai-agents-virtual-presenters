import { useState, useRef } from 'react'
import Header from './components/Header'
import TopicInput from './components/TopicInput'
import AvatarSelector from './components/AvatarSelector'
import GenerateButton from './components/GenerateButton'
import VideoPlayer from './components/VideoPlayer'
import LoadingOverlay from './components/LoadingOverlay'
import './App.css'

const API_URL = '/api'

function App() {
  const [topic, setTopic] = useState('')
  const [avatarType, setAvatarType] = useState('male')
  const [uploadedImage, setUploadedImage] = useState(null)
  const [videoUrl, setVideoUrl] = useState(null)
  const [subtitleUrl, setSubtitleUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [error, setError] = useState(null)
  const [generatedScript, setGeneratedScript] = useState(null)

  const fileInputRef = useRef(null)

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB')
        return
      }
      setUploadedImage(file)
      setError(null)
    }
  }

  const clearUploadedImage = () => {
    setUploadedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic')
      return
    }

    setIsLoading(true)
    setError(null)
    setVideoUrl(null)
    setSubtitleUrl(null)
    setGeneratedScript(null)

    try {
      const formData = new FormData()
      formData.append('topic', topic.trim())
      formData.append('avatar', avatarType)

      if (uploadedImage) {
        formData.append('image', uploadedImage)
      }

      // Step 1: Generating script
      setLoadingMessage('Generating AI script...')

      // Simulate some delay for UX
      await new Promise(resolve => setTimeout(resolve, 500))

      setLoadingMessage('Creating voiceover...')

      const response = await fetch(`${API_URL}/generate-video`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Generation failed')
      }

      if (data.success) {
        setVideoUrl(data.data.videoUrl)
        setSubtitleUrl(data.data.subtitleUrl)
        setGeneratedScript(data.data.scriptPreview)
        setLoadingMessage('Video ready!')
      } else {
        throw new Error(data.message || 'Unknown error occurred')
      }

    } catch (err) {
      console.error('Generation error:', err)
      setError(err.message || 'Failed to generate video. Please try again.')
    } finally {
      setIsLoading(false)
      setLoadingMessage('')
    }
  }

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <div className="generator-container">
          <div className="input-section">
            <TopicInput
              value={topic}
              onChange={setTopic}
              disabled={isLoading}
            />

            <AvatarSelector
              avatarType={avatarType}
              onAvatarChange={setAvatarType}
              uploadedImage={uploadedImage}
              onImageUpload={handleImageUpload}
              onClearImage={clearUploadedImage}
              fileInputRef={fileInputRef}
              disabled={isLoading}
            />

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <GenerateButton
              onClick={handleGenerate}
              disabled={isLoading || !topic.trim()}
              isLoading={isLoading}
            />
          </div>

          <div className="output-section">
            <VideoPlayer
              videoUrl={videoUrl}
              subtitleUrl={subtitleUrl}
              isLoading={isLoading}
              loadingMessage={loadingMessage}
            />

            {generatedScript && (
              <div className="script-preview">
                <h3>Generated Script Preview</h3>
                <p>{generatedScript}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {isLoading && <LoadingOverlay message={loadingMessage} />}

      <footer className="footer">
        <p>Powered by Google Gemini, ElevenLabs & SadTalker</p>
      </footer>
    </div>
  )
}

export default App
