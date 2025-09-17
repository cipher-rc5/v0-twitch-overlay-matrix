"use client"

import type React from "react"
import { useState } from "react"

const SideCards: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="side-cards">
      <div
        className={`card about-card ${hoveredCard === "about" ? "hovered" : ""}`}
        onMouseEnter={() => setHoveredCard("about")}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="3" stroke="#ffff00" strokeWidth="2" />
            <path d="M12 14c-4 0-7 2-7 5v1h14v-1c0-3-3-5-7-5z" stroke="#ffff00" strokeWidth="2" />
          </svg>
        </div>
        <div className="card-text">ABOUT ME</div>
        <div className="card-border-effect"></div>
      </div>

      <div
        className={`card links-card ${hoveredCard === "links" ? "hovered" : ""}`}
        onMouseEnter={() => setHoveredCard("links")}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#ffff00" strokeWidth="2" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#ffff00" strokeWidth="2" />
          </svg>
        </div>
        <div className="card-text">LINKS</div>
        <div className="card-border-effect"></div>
      </div>

      <style jsx>{`
        .side-cards {
          position: absolute;
          left: 60px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 20px;
          z-index: 15;
          animation: slideInFromLeft 2s ease-out 0.5s both;
        }
        
        .card {
          background: rgba(0, 0, 0, 0.9);
          border: 2px solid #ffff00;
          padding: 20px;
          width: 200px;
          display: flex;
          align-items: center;
          gap: 15px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(255, 255, 0, 0.1);
        }
        
        .card:hover,
        .card.hovered {
          background: rgba(255, 255, 0, 0.15);
          transform: translateX(15px) scale(1.05);
          box-shadow: 
            0 8px 30px rgba(255, 255, 0, 0.3),
            inset 0 0 20px rgba(255, 255, 0, 0.1);
          border-color: #ffff88;
        }
        
        .card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        /* Removed rotation animation on hover */
        .card:hover .card-icon,
        .card.hovered .card-icon {
          transform: scale(1.1);
        }
        
        .card-icon svg {
          filter: drop-shadow(0 0 5px rgba(255, 255, 0, 0.5));
        }
        
        .card-text {
          color: #ffffff;
          font-family: 'Terminess', 'Courier New', monospace;
          font-size: 16px;
          font-weight: bold;
          letter-spacing: 1px;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }
        
        .card:hover .card-text,
        .card.hovered .card-text {
          color: #ffff00;
          text-shadow: 0 0 15px rgba(255, 255, 0, 0.8);
        }
        
        .card-border-effect {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 0, 0.4),
            transparent
          );
          transition: left 0.6s ease;
        }
        
        .card:hover .card-border-effect,
        .card.hovered .card-border-effect {
          left: 100%;
        }
        
        /* Responsive Design */
        @media (max-width: 2560px) {
          .side-cards {
            left: 50px;
          }
          
          .card {
            width: 180px;
            padding: 18px;
          }
          
          .card-text {
            font-size: 14px;
          }
        }
        
        @media (max-width: 1920px) {
          .side-cards {
            left: 40px;
          }
          
          .card {
            width: 160px;
            padding: 15px;
          }
          
          .card-text {
            font-size: 12px;
          }
          
          .card-icon svg {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>
    </div>
  )
}

export default SideCards
