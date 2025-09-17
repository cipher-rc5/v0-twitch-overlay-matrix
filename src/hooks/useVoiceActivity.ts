"use client"

import { useState, useEffect, useRef } from "react"

interface VoiceActivityOptions {
  threshold?: number
  smoothingTimeConstant?: number
  fftSize?: number
}

interface VoiceActivityData {
  isActive: boolean
  volume: number
  frequency: number
  frequencyData: Uint8Array
}

export const useVoiceActivity = (options: VoiceActivityOptions = {}): VoiceActivityData => {
  const { threshold = 30, smoothingTimeConstant = 0.8, fftSize = 256 } = options

  const [isActive, setIsActive] = useState(false)
  const [volume, setVolume] = useState(0)
  const [frequency, setFrequency] = useState(0)
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(128))

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  const initializeAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream)

      analyserRef.current.smoothingTimeConstant = smoothingTimeConstant
      analyserRef.current.fftSize = fftSize

      const bufferLength = analyserRef.current.frequencyBinCount
      dataArrayRef.current = new Uint8Array(bufferLength)

      microphoneRef.current.connect(analyserRef.current)

      startAnalysis()
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const startAnalysis = () => {
    if (!analyserRef.current || !dataArrayRef.current) return

    const analyze = () => {
      if (!analyserRef.current || !dataArrayRef.current) return

      analyserRef.current.getByteFrequencyData(dataArrayRef.current)

      // Calculate volume (RMS)
      let sum = 0
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        sum += dataArrayRef.current[i] * dataArrayRef.current[i]
      }
      const rms = Math.sqrt(sum / dataArrayRef.current.length)
      const volumeLevel = Math.min(100, (rms / 128) * 100)

      // Calculate dominant frequency
      let maxIndex = 0
      let maxValue = 0
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        if (dataArrayRef.current[i] > maxValue) {
          maxValue = dataArrayRef.current[i]
          maxIndex = i
        }
      }
      const dominantFreq = (maxIndex * audioContextRef.current!.sampleRate) / (2 * dataArrayRef.current.length)

      setVolume(volumeLevel)
      setFrequency(dominantFreq)
      setIsActive(volumeLevel > threshold)
      setFrequencyData(new Uint8Array(dataArrayRef.current))

      animationFrameRef.current = requestAnimationFrame(analyze)
    }

    analyze()
  }

  const cleanup = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    if (microphoneRef.current) {
      microphoneRef.current.disconnect()
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }
  }

  useEffect(() => {
    initializeAudio()
    return cleanup
  }, [])

  return { isActive, volume, frequency, frequencyData }
}
