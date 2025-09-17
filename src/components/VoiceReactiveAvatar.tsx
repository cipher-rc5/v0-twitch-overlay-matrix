"use client"

import type React from "react"
import { useVoiceActivity } from "../hooks/useVoiceActivity"

interface VoiceReactiveAvatarProps {
  isLive: boolean
}

const VoiceReactiveAvatar: React.FC<VoiceReactiveAvatarProps> = ({ isLive }) => {
  const {
    isActive: isVoiceActive,
    volume: audioLevel,
    frequencyData,
  } = useVoiceActivity({
    threshold: 25,
    smoothingTimeConstant: 0.8,
    fftSize: 512,
  })

  return (
    <div className="voice-avatar">
      <div className="amplitude-visualization">
        <div className="amplitude-bars">
          {[...Array(48)].map((_, i) => {
            const dataIndex = Math.floor((i / 48) * frequencyData.length)
            const amplitude = isVoiceActive ? frequencyData[dataIndex] || 0 : 0
            const height = Math.max(8, (amplitude / 255) * 100)

            return (
              <div
                key={i}
                className="amplitude-bar"
                style={{
                  height: `${height}%`,
                  background:
                    amplitude > 0
                      ? `hsl(${60 + amplitude * 0.3}, 100%, ${50 + amplitude * 0.2}%)`
                      : "rgba(255, 255, 0, 0.1)",
                }}
              />
            )
          })}
        </div>
        <div className="amplitude-level">{isVoiceActive ? `${Math.round(audioLevel)}%` : "SILENT"}</div>
      </div>

      <div className="avatar-section">
        {isLive && (
          <div className="live-button">
            <span>LIVE</span>
            <div className="live-dot"></div>
          </div>
        )}

        <div className={`avatar-container ${isVoiceActive ? "voice-active" : ""}`}>
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/monster_pfp.gif-r8E4BtKKAsfd7s0ctEHgu8aQVvIcNh.jpeg"
            alt="Cipher Avatar"
            className="avatar-image"
          />

          <div className={`voice-ring ${isVoiceActive ? "active" : ""}`}>
            <div
              className="ring-pulse"
              style={{
                animationDuration: `${Math.max(0.5, 2 - audioLevel / 50)}s`,
              }}
            ></div>
          </div>

          <div className="avatar-corners">
            <div className="corner-accent top-left"></div>
            <div className="corner-accent top-right"></div>
            <div className="corner-accent bottom-left"></div>
            <div className="corner-accent bottom-right"></div>
          </div>
        </div>

        <div className="status-text">{isVoiceActive ? "SPEAKING" : "LISTENING"}</div>
      </div>

      <style jsx>{`
        .voice-avatar {
          position: absolute;
          bottom: 60px;
          right: 80px;
          z-index: 25;
          animation: slideInFromRight 2s ease-out 1s both;
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .amplitude-visualization {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          background: rgba(0, 0, 0, 0.8);
          padding: 15px 10px;
          border-radius: 15px;
          border: 2px solid #ffff00;
          backdrop-filter: blur(10px);
          /* Reduced glow effect from 20px to 8px */
          box-shadow: 0 0 8px rgba(255, 255, 0, 0.2);
        }
        
        .amplitude-bars {
          display: flex;
          gap: 3px;
          align-items: end;
          height: 80px;
          width: 280px;
          position: relative;
          /* Added padding to ensure bars don't touch edges */
          padding: 0 5px;
        }
        
        .amplitude-bar {
          width: 3px;
          background: #ffff00;
          border-radius: 1px;
          /* Removed wave-like animation, now shows static bars that update with real audio */
          transition: height 0.1s ease-out, background 0.1s ease;
          /* Reduced glow effect and made it more subtle for individual bars */
          box-shadow: 0 0 2px currentColor;
          min-height: 8%;
          /* Added subtle border to make individual bars more distinct */
          border: 1px solid rgba(255, 255, 0, 0.3);
        }
        
        .amplitude-level {
          font-family: 'Terminess', 'Courier New', monospace;
          font-size: 12px;
          color: #ffff00;
          font-weight: bold;
          text-align: center;
          /* Reduced text glow effect from 10px to 5px */
          text-shadow: 0 0 5px rgba(255, 255, 0, 0.6);
        }
        
        .avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }
        
        .live-button {
          background: rgba(0, 0, 0, 0.9);
          border: 2px solid #ffff00;
          border-radius: 8px;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          font-family: 'Terminess', 'Courier New', monospace;
          font-size: 14px;
          font-weight: bold;
          color: #ffff00;
          /* Further reduced text glow effect from 5px to 3px */
          text-shadow: 0 0 3px rgba(255, 255, 0, 0.4);
          /* Further reduced box glow effects */
          box-shadow: 
            0 0 5px rgba(255, 255, 0, 0.15),
            inset 0 0 3px rgba(255, 255, 0, 0.08);
          backdrop-filter: blur(10px);
          animation: liveButtonGlow 2s ease-in-out infinite alternate;
          width: 100%;
        }
        
        .live-dot {
          width: 10px;
          height: 10px;
          background: #ff0000;
          border-radius: 50%;
          animation: liveDotPulse 1s infinite;
          /* Reduced dot glow effect from 10px to 5px */
          box-shadow: 0 0 5px rgba(255, 0, 0, 0.6);
        }
        
        .avatar-container {
          position: relative;
          width: 220px;
          height: 220px;
          border: 3px solid #ffff00;
          border-radius: 15px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          /* Reduced container glow effects */
          box-shadow: 
            0 0 10px rgba(255, 255, 0, 0.2),
            inset 0 0 10px rgba(255, 255, 0, 0.05);
          backdrop-filter: blur(5px);
        }
        
        .avatar-container.voice-active {
          border-color: #ffff88;
          /* Reduced active glow effects and made movement more subtle */
          box-shadow: 
            0 0 15px rgba(255, 255, 0, 0.4),
            0 0 25px rgba(255, 255, 0, 0.2),
            inset 0 0 15px rgba(255, 255, 0, 0.1);
          /* Made scaling and rotation more subtle */
          transform: scale(1.02) rotate(0.5deg);
        }
        
        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          /* Made filter effects more subtle */
          filter: ${isVoiceActive ? "brightness(1.1) contrast(1.05) saturate(1.05)" : "brightness(1)"};
          transition: filter 0.3s ease;
        }
        
        .voice-ring {
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          border-radius: 20px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .voice-ring.active {
          opacity: 1;
        }
        
        .ring-pulse {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border: 2px solid #ffff00;
          border-radius: 20px;
          animation: ringPulse 1s ease-out infinite;
        }
        
        .avatar-corners {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
        
        .corner-accent {
          position: absolute;
          width: 15px;
          height: 15px;
          border: 2px solid #ffff00;
          transition: all 0.3s ease;
        }
        
        .corner-accent.top-left {
          top: 10px;
          left: 10px;
          border-right: none;
          border-bottom: none;
        }
        
        .corner-accent.top-right {
          top: 10px;
          right: 10px;
          border-left: none;
          border-bottom: none;
        }
        
        .corner-accent.bottom-left {
          bottom: 10px;
          left: 10px;
          border-right: none;
          border-top: none;
        }
        
        .corner-accent.bottom-right {
          bottom: 10px;
          right: 10px;
          border-left: none;
          border-top: none;
        }
        
        .avatar-container.voice-active .corner-accent {
          border-color: #ffff88;
          /* Reduced corner accent glow effect */
          box-shadow: 0 0 5px rgba(255, 255, 0, 0.3);
        }
        
        .status-text {
          font-family: 'Terminess', 'Courier New', monospace;
          font-size: 12px;
          color: ${isVoiceActive ? "#ffff00" : "#888888"};
          font-weight: bold;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          /* Reduced status text glow effect */
          text-shadow: 0 0 5px currentColor;
          text-align: center;
        }
        
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes amplitudeBar {
          0% { height: 20%; opacity: 0.7; }
          100% { height: 100%; opacity: 1; }
        }
        
        @keyframes ringPulse {
          0% { 
            transform: scale(1); 
            opacity: 0.8; 
          }
          100% { 
            transform: scale(1.3); 
            opacity: 0; 
          }
        }
        
        /* Reduced LIVE button glow animation intensity */
        @keyframes liveButtonGlow {
          0% { 
            box-shadow: 
              0 0 5px rgba(255, 255, 0, 0.15),
              inset 0 0 3px rgba(255, 255, 0, 0.08);
          }
          100% { 
            box-shadow: 
              0 0 8px rgba(255, 255, 0, 0.2),
              inset 0 0 5px rgba(255, 255, 0, 0.12);
          }
        }
        
        /* Reduced live dot pulse glow effect */
        @keyframes liveDotPulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
            box-shadow: 0 0 5px rgba(255, 0, 0, 0.6);
          }
          50% { 
            opacity: 0.6; 
            transform: scale(1.3);
            box-shadow: 0 0 8px rgba(255, 0, 0, 0.8);
          }
        }
        
        /* Responsive Design */
        @media (max-width: 2560px) {
          .voice-avatar {
            bottom: 50px;
            right: 70px;
          }
          
          .avatar-container {
            width: 200px;
            height: 200px;
          }
          
          .amplitude-bars {
            /* Updated responsive width to match new container size */
            width: 240px;
          }
        }
        
        @media (max-width: 1920px) {
          .voice-avatar {
            bottom: 40px;
            right: 60px;
          }
          
          .avatar-container {
            width: 180px;
            height: 180px;
          }
          
          .amplitude-bars {
            /* Updated responsive width to match new container size */
            width: 200px;
          }

          .live-button {
            font-size: 12px;
            padding: 6px 12px;
          }
          
          .status-text {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  )
}

export default VoiceReactiveAvatar
