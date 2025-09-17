"use client"

import type React from "react"
import { useState, useEffect } from "react"
import CornerBrackets from "./CornerBrackets"
import Header from "./Header"
import SideCards from "./SideCards"
import StreamStatus from "./StreamStatus"
import VoiceReactiveAvatar from "./VoiceReactiveAvatar"
import MicrophonePermission from "./MicrophonePermission"
import MatrixBackground from "./MatrixBackground"

const StreamOverlay: React.FC = () => {
  const [isLive, setIsLive] = useState(false)
  const [streamStatus, setStreamStatus] = useState<"starting" | "live" | "offline">("starting")
  const [micPermissionGranted, setMicPermissionGranted] = useState(false)

  useEffect(() => {
    // Simulate stream status changes for demo
    const timer = setTimeout(() => {
      setStreamStatus("live")
      setIsLive(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    navigator.permissions
      ?.query({ name: "microphone" as PermissionName })
      .then((permission) => {
        setMicPermissionGranted(permission.state === "granted")
        permission.onchange = () => {
          setMicPermissionGranted(permission.state === "granted")
        }
      })
      .catch(() => {
        setMicPermissionGranted(true)
      })
  }, [])

  return (
    <div className="overlay-container">
      <MatrixBackground opacity={0.12} speed={60} fontSize={16} color="#00ff41" />

      <CornerBrackets />
      <Header />
      <SideCards />
      <StreamStatus status={streamStatus} />
      <VoiceReactiveAvatar isLive={isLive} />

      {!micPermissionGranted && <MicrophonePermission onPermissionGranted={() => setMicPermissionGranted(true)} />}

      <style jsx>{`
        .overlay-container {
          position: relative;
          width: 3440px;
          height: 1440px;
          background: transparent;
          font-family: 'Courier New', monospace;
          color: #ffffff;
          overflow: hidden;
          /* Added responsive scaling with smooth transitions */
          transition: transform 0.3s ease;
        }
        
        /* Enhanced responsive breakpoints for ultrawide support */
        @media (max-width: 3440px) and (min-width: 2560px) {
          .overlay-container {
            width: 100vw;
            height: 100vh;
            transform-origin: top left;
            transform: scale(calc(100vw / 3440));
          }
        }
        
        @media (max-width: 2560px) and (min-width: 1920px) {
          .overlay-container {
            width: 100vw;
            height: 100vh;
            transform-origin: top left;
            transform: scale(calc(100vw / 3440));
          }
        }
        
        @media (max-width: 1920px) {
          .overlay-container {
            width: 100vw;
            height: 100vh;
            transform-origin: top left;
            transform: scale(calc(100vw / 3440));
          }
        }
        
        /* Added mobile support */
        @media (max-width: 768px) {
          .overlay-container {
            width: 100vw;
            height: 100vh;
            transform: scale(calc(100vw / 3440));
          }
        }
      `}</style>
    </div>
  )
}

export default StreamOverlay
