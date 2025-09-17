"use client"

import type React from "react"
import { useEffect, useRef } from "react"

interface MatrixBackgroundProps {
  opacity?: number
  speed?: number
  fontSize?: number
  color?: string
}

const MatrixBackground: React.FC<MatrixBackgroundProps> = ({
  opacity = 0.15,
  speed = 50,
  fontSize = 14,
  color = "#00ff00",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to match overlay container
    canvas.width = 3440
    canvas.height = 1440

    // Matrix characters - mix of katakana, numbers, and symbols
    const chars =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?"
    const charArray = chars.split("")

    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = []

    // Initialize drops array
    for (let i = 0; i < columns; i++) {
      drops[i] = (Math.random() * canvas.height) / fontSize
    }

    const draw = () => {
      // Create fade effect by drawing semi-transparent black rectangle
      ctx.fillStyle = `rgba(0, 0, 0, 0.05)`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set text properties
      ctx.fillStyle = color
      ctx.font = `${fontSize}px 'Terminess', 'Courier New', monospace`
      ctx.textAlign = "left"

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        ctx.fillStyle = color
        ctx.fillText(char, x, y)

        // Add slight glow effect for cyberpunk aesthetic
        ctx.shadowColor = color
        ctx.shadowBlur = 3
        ctx.fillText(char, x, y)
        ctx.shadowBlur = 0

        // Reset drop to top when it reaches bottom or randomly
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        // Move drop down
        drops[i]++
      }
    }

    const interval = setInterval(draw, speed)

    return () => clearInterval(interval)
  }, [opacity, speed, fontSize, color])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        zIndex: -1,
        width: "100%",
        height: "100%",
      }}
    />
  )
}

export default MatrixBackground
