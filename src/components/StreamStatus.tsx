"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface StreamStatusProps {
  status: "starting" | "live" | "offline"
}

const StreamStatus: React.FC<StreamStatusProps> = ({ status }) => {
  const [animatedText, setAnimatedText] = useState("")

  const getStatusText = () => {
    switch (status) {
      case "starting":
        return "STARTING SOON"
      case "live":
        return "LIVE NOW"
      case "offline":
        return "OFFLINE"
      default:
        return "STARTING SOON"
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "live":
        return "#ffff00"
      case "starting":
        return "#ffff00"
      case "offline":
        return "#ff0000"
      default:
        return "#ffff00"
    }
  }

  useEffect(() => {
    const statusText = getStatusText()
    let currentIndex = 0
    setAnimatedText("")

    const typeInterval = setInterval(() => {
      if (currentIndex <= statusText.length) {
        setAnimatedText(statusText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typeInterval)
      }
    }, 100)

    return () => clearInterval(typeInterval)
  }, [status])

  return (
    <div className="stream-status">
      <div className="status-label">THE STREAM IS</div>
      <div className="status-text" style={{ color: getStatusColor() }}>
        {animatedText}
        <span className="status-cursor">_</span>
      </div>
      <div className="website">ciphermarket.xyz</div>

      <div className="matrix-bg">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`matrix-char matrix-${i}`}>
            {Math.random() > 0.5 ? "1" : "0"}
          </div>
        ))}
      </div>

      <style jsx>{`
        .stream-status {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 20;
          animation: slideInFromCenter 2s ease-out;
        }
        
        .status-label {
          color: #ffffff;
          font-family: 'Terminess', 'Courier New', monospace;
          font-size: 24px;
          letter-spacing: 2px;
          margin-bottom: 10px;
          animation: fadeInUp 1.5s ease-out 0.5s both;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }
        
        .status-text {
          font-family: 'Terminess', 'Courier New', monospace;
          font-size: 48px;
          font-weight: bold;
          letter-spacing: 4px;
          margin-bottom: 20px;
          animation: ${status === "live" ? "livePulse" : "statusGlow"} 2s infinite;
          text-shadow: 0 0 20px currentColor;
          position: relative;
        }
        
        .status-cursor {
          animation: blink 1s infinite;
          color: #ffff00;
        }
        
        .website {
          color: #888888;
          font-family: 'Terminess', 'Courier New', monospace;
          font-size: 18px;
          letter-spacing: 1px;
          animation: fadeInUp 1.5s ease-out 1s both;
          transition: color 0.3s ease;
        }
        
        .website:hover {
          color: #ffff00;
          text-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
        }
        
        .matrix-bg {
          position: absolute;
          top: -100px;
          left: -200px;
          right: -200px;
          bottom: -100px;
          pointer-events: none;
          opacity: 0.1;
          z-index: -1;
        }
        
        .matrix-char {
          position: absolute;
          color: #ffff00;
          font-family: 'Terminess', 'Courier New', monospace;
          font-size: 14px;
          animation: matrixFall 3s linear infinite;
        }
        
        ${[...Array(20)]
          .map(
            (_, i) => `
          .matrix-${i} {
            left: ${i * 5 + Math.random() * 10}%;
            animation-delay: ${Math.random() * 3}s;
            animation-duration: ${3 + Math.random() * 2}s;
          }
        `,
          )
          .join("")}
        
        @keyframes slideInFromCenter {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes livePulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
            text-shadow: 0 0 20px currentColor;
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.05);
            text-shadow: 0 0 30px currentColor, 0 0 40px currentColor;
          }
        }
        
        @keyframes statusGlow {
          0%, 100% { 
            text-shadow: 0 0 20px currentColor;
          }
          50% { 
            text-shadow: 0 0 30px currentColor, 0 0 40px currentColor;
          }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes matrixFall {
          0% {
            transform: translateY(-100px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(400px);
            opacity: 0;
          }
        }
        
        /* Responsive Design */
        @media (max-width: 2560px) {
          .status-label {
            font-size: 20px;
          }
          
          .status-text {
            font-size: 40px;
          }
          
          .website {
            font-size: 16px;
          }
        }
        
        @media (max-width: 1920px) {
          .status-label {
            font-size: 18px;
          }
          
          .status-text {
            font-size: 32px;
          }
          
          .website {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  )
}

export default StreamStatus
