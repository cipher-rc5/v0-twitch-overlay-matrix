"use client"

import type React from "react"

const CornerBrackets: React.FC = () => {
  return (
    <>
      {/* Top Left */}
      <div className="corner-bracket top-left">
        <div className="bracket-line horizontal"></div>
        <div className="bracket-line vertical"></div>
      </div>

      {/* Top Right */}
      <div className="corner-bracket top-right">
        <div className="bracket-line horizontal"></div>
        <div className="bracket-line vertical"></div>
      </div>

      {/* Bottom Left */}
      <div className="corner-bracket bottom-left">
        <div className="bracket-line horizontal"></div>
        <div className="bracket-line vertical"></div>
      </div>

      {/* Bottom Right */}
      <div className="corner-bracket bottom-right">
        <div className="bracket-line horizontal"></div>
        <div className="bracket-line vertical"></div>
      </div>

      <style jsx>{`
        .corner-bracket {
          position: absolute;
          width: 120px;
          height: 120px;
          z-index: 10;
          animation: fadeInCorner 2s ease-out;
        }
        
        .bracket-line {
          background: #ffff00;
          position: absolute;
          box-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
          animation: glowPulse 3s ease-in-out infinite;
        }
        
        .bracket-line.horizontal {
          height: 3px;
          width: 80px;
          animation: slideInHorizontal 1.5s ease-out, glowPulse 3s ease-in-out infinite 1.5s;
        }
        
        .bracket-line.vertical {
          width: 3px;
          height: 80px;
          animation: slideInVertical 1.5s ease-out 0.3s both, glowPulse 3s ease-in-out infinite 1.8s;
        }
        
        /* Position-specific styles */
        .top-left {
          top: 40px;
          left: 40px;
        }
        
        .top-left .horizontal {
          top: 0;
          left: 0;
        }
        
        .top-left .vertical {
          top: 0;
          left: 0;
        }
        
        .top-right {
          top: 40px;
          right: 40px;
        }
        
        .top-right .horizontal {
          top: 0;
          right: 0;
        }
        
        .top-right .vertical {
          top: 0;
          right: 0;
        }
        
        .bottom-left {
          bottom: 40px;
          left: 40px;
        }
        
        .bottom-left .horizontal {
          bottom: 0;
          left: 0;
        }
        
        .bottom-left .vertical {
          bottom: 0;
          left: 0;
        }
        
        .bottom-right {
          bottom: 40px;
          right: 40px;
        }
        
        .bottom-right .horizontal {
          bottom: 0;
          right: 0;
        }
        
        .bottom-right .vertical {
          bottom: 0;
          right: 0;
        }
        
        /* Animations */
        @keyframes fadeInCorner {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInHorizontal {
          from { width: 0; }
          to { width: 80px; }
        }
        
        @keyframes slideInVertical {
          from { height: 0; }
          to { height: 80px; }
        }
        
        @keyframes glowPulse {
          0%, 100% { 
            box-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
          }
          50% { 
            box-shadow: 0 0 20px rgba(255, 255, 0, 0.8), 0 0 30px rgba(255, 255, 0, 0.3);
          }
        }
        
        /* Responsive Design */
        @media (max-width: 2560px) {
          .corner-bracket {
            width: 100px;
            height: 100px;
          }
          
          .bracket-line.horizontal {
            width: 65px;
          }
          
          .bracket-line.vertical {
            height: 65px;
          }
        }
        
        @media (max-width: 1920px) {
          .corner-bracket {
            width: 80px;
            height: 80px;
          }
          
          .bracket-line.horizontal {
            width: 50px;
          }
          
          .bracket-line.vertical {
            height: 50px;
          }
        }
      `}</style>
    </>
  )
}

export default CornerBrackets
