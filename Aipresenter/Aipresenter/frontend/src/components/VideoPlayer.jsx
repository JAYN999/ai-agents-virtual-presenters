import "../styles/VideoPlayer.css";

function VideoPlayer({ videoUrl, subtitleUrl, isLoading, loadingMessage }) {
  const resolvedSubtitleUrl =
    subtitleUrl ||
    (videoUrl
      ? videoUrl.replace(".mp4", ".vtt")
      : null);

  return (
    <div className="video-player-container">
      <h2 className="section-title">
        <span className="title-icon">🎥</span>
        Generated Video
      </h2>

      <div className="video-wrapper">
        {videoUrl ? (
          <video
            className="video-element"
            controls
            autoPlay
          >
            <source src={videoUrl} type="video/mp4" />

            {resolvedSubtitleUrl && (
              <track
                src={resolvedSubtitleUrl}
                kind="subtitles"
                srcLang="en"
                label="English"
                default
              />
            )}

            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="video-placeholder">
            {isLoading ? (
              <div className="loading-state">
                <div className="loading-animation">
                  <div className="loading-circle"></div>
                  <div className="loading-circle"></div>
                  <div className="loading-circle"></div>
                </div>

                <p className="loading-text">
                  {loadingMessage || "Processing..."}
                </p>

                <div className="loading-steps">
                  <div className="step">
                    <span className="step-icon">🤖</span>
                    <span>AI Script Generation</span>
                  </div>

                  <div className="step">
                    <span className="step-icon">🎙️</span>
                    <span>Voice Synthesis</span>
                  </div>

                  <div className="step">
                    <span className="step-icon">🎬</span>
                    <span>Lip-Sync Video + Captions</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">🎬</span>
                <p className="empty-text">
                  Your AI-generated video will appear here
                </p>
                <p className="empty-hint">
                  Enter a topic and click Generate to start
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {videoUrl && (
        <div className="video-actions">
          <a
            href={videoUrl}
            download="ai-presentation.mp4"
            className="download-button"
          >
            <span className="download-icon">⬇️</span>
            Download Video
          </a>

        </div>
      )}
    </div>
  );
}

export default VideoPlayer;