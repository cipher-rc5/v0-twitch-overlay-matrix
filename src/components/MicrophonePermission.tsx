'use client';
import type React from 'react';

interface MicrophonePermissionProps {
  state: 'checking' | 'prompt' | 'requesting' | 'denied' | 'error';
  errorMessage: string | null;
  onRequestPermission: () => void;
}

const MicrophonePermission: React.FC<MicrophonePermissionProps> = (
  { state, errorMessage, onRequestPermission }
) => {
  const isRequesting = state === 'checking' || state === 'requesting';
  const title = state === 'denied' ? 'Microphone Access Blocked' : 'Microphone Access Required';
  const message = errorMessage ??
    (state === 'denied' ?
      'Enable microphone permissions in your browser settings, then retry.' :
      'Enable microphone access for voice-reactive animations.');

  return (
    <div className='mic-permission-overlay'>
      <div className='permission-modal'>
        <div className='modal-icon'>🎤</div>
        <h3>{title}</h3>
        <p>{message}</p>
        <button onClick={onRequestPermission} disabled={isRequesting} className='permission-button'>
          {isRequesting ? 'Requesting...' : 'Enable Microphone'}
        </button>
      </div>

      <style jsx>
        {`
        .mic-permission-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .permission-modal {
          background: #1a1a1a;
          border: 2px solid #00ff00;
          border-radius: 10px;
          padding: 30px;
          text-align: center;
          max-width: 400px;
        }

        .modal-icon {
          font-size: 48px;
          margin-bottom: 20px;
          filter: grayscale(1) brightness(2);
        }

        .permission-modal h3 {
          color: #ffffff;
          font-family: 'Courier New', monospace;
          font-size: 24px;
          margin-bottom: 15px;
        }

        .permission-modal p {
          color: #cccccc;
          font-family: 'Courier New', monospace;
          font-size: 16px;
          margin-bottom: 25px;
          line-height: 1.5;
        }

        .permission-button {
          background: #00ff00;
          color: #000000;
          border: none;
          padding: 12px 24px;
          font-family: 'Courier New', monospace;
          font-size: 16px;
          font-weight: bold;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .permission-button:hover:not(:disabled) {
          background: #00cc00;
          transform: translateY(-2px);
        }

        .permission-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}
      </style>
    </div>
  );
};

export default MicrophonePermission;
