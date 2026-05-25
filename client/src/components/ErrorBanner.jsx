import React from 'react';

function ErrorBanner({ error, onRetry }) {
  if (!error) return null;

  return (
    <div className="error-banner animate-fade-in">
      <div className="error-message">
        <span className="error-icon">⚠️</span>
        <div>
          <h4>API Connection Error</h4>
          <p>{error}</p>
        </div>
      </div>
      <button className="btn-retry" onClick={onRetry}>
        Try Reconnecting
      </button>
    </div>
  );
}

export default ErrorBanner;
