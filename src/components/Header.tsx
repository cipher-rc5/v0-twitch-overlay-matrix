"use client"

import type React from "react"
import { useState, useEffect } from "react"

const Header: React.FC = () => {
  const [displayText, setDisplayText] = useState("")
  const fullText = "ℭ𝔦𝔭𝔥𝔢𝔯"

  useEffect(() => {
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
      }
    }, 200)

    return () => clearInterval(typingInterval)
  }, [])

  return (
    <div className="header">
      <div className="cipher-text">
        <span className="dots">◆◆◆</span>
        <span className="cipher-name">
          {displayText}
          <span className="cursor">|</span>
        </span>
        <span className="dots">◆◆◆</span>
      </div>

      <div className="particles">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`particle particle-${i}`}>
            ◆
          </div>
        ))}
      </div>

      <style jsx>{`
        .header {
          position: absolute;
          top: 60px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          animation: slideInFromTop 1.5s ease-out;
        }
        
        .cipher-text {
          display: flex;
          align-items: center;
          gap: 20px;
          color: #ffffff;
          /* Updated font family to use Terminess */
          font-family: 'Terminess', 'Courier New', monospace;
          position: relative;
        }
        
        .cipher-name {
          font-size: 18px;
          font-weight: bold;
          letter-spacing: 2px;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          position: relative;
        }
        
        /* Removed blinking cursor animation */
        .cursor {
          color: #ffff00;
          opacity: 0;
        }
        
        .dots {
          /* Changed dots color from green to yellow */
          color: #ffff00;
          font-size: 14px;
          animation: pulse 2s infinite;
          /* Updated text shadow to yellow */
          text-shadow: 0 0 15px rgba(255, 255, 0, 0.8);
        }
        
        .particles {
          position: absolute;
          top: -20px;
          left: -50px;
          right: -50px;
          height: 80px;
          pointer-events: none;
        }
        
        .particle {
          position: absolute;
          /* Changed particle color from green to yellow */
          color: #ffff00;
          font-size: 8px;
          opacity: 0.6;
          animation: float 4s ease-in-out infinite;
        }
        
        .particle-0 { left: 10%; animation-delay: 0s; }
        .particle-1 { left: 25%; animation-delay: 0.5s; }
        .particle-2 { left: 40%; animation-delay: 1s; }
        .particle-3 { left: 60%; animation-delay: 1.5s; }
        .particle-4 { left: 75%; animation-delay: 2s; }
        .particle-5 { left: 90%; animation-delay: 2.5s; }
        
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
            /* Updated pulse shadow to yellow */
            text-shadow: 0 0 15px rgba(255, 255, 0, 0.8);
          }
          50% { 
            opacity: 0.7; 
            transform: scale(1.1);
            /* Updated pulse shadow to yellow */
            text-shadow: 0 0 25px rgba(255, 255, 0, 1);
          }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) rotate(0deg); 
            opacity: 0.6; 
          }
          25% { 
            transform: translateY(-15px) rotate(90deg); 
            opacity: 0.8; 
          }
          50% { 
            transform: translateY(-25px) rotate(180deg); 
            opacity: 1; 
          }
          75% { 
            transform: translateY(-15px) rotate(270deg); 
            opacity: 0.8; 
          }
        }
        
        /* Responsive Design */
        @media (max-width: 2560px) {
          .cipher-name {
            font-size: 16px;
          }
          
          .dots {
            font-size: 12px;
          }
        }
        
        @media (max-width: 1920px) {
          .header {
            top: 40px;
          }
          
          .cipher-name {
            font-size: 14px;
          }
          
          .dots {
            font-size: 10px;
          }
          
          .cipher-text {
            gap: 15px;
          }
        }
      `}</style>
    </div>
  )
}

export default Header
