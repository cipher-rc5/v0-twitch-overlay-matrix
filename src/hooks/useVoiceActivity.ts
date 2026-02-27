'use client';
import { useEffect, useRef, useState } from 'react';

interface VoiceActivityOptions {
  stream: MediaStream | null;
  threshold?: number;
  smoothingTimeConstant?: number;
  fftSize?: number;
  sampleRate?: number;
}

interface VoiceActivityData {
  isActive: boolean;
  volume: number;
  frequency: number;
  frequencyData: Uint8Array<ArrayBuffer>;
  status: 'idle' | 'active';
}

type WindowWithWebkitAudioContext = Window & { webkitAudioContext?: new () => AudioContext };

export const useVoiceActivity = (options: VoiceActivityOptions): VoiceActivityData => {
  const { stream, threshold = 30, smoothingTimeConstant = 0.8, fftSize = 256, sampleRate = 30 } = options;

  const [isActive, setIsActive] = useState(false);
  const [volume, setVolume] = useState(0);
  const [frequency, setFrequency] = useState(0);
  const [frequencyData, setFrequencyData] = useState<Uint8Array<ArrayBuffer>>(new Uint8Array(128));
  const [status, setStatus] = useState<'idle' | 'active'>('idle');

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);
  const lastPublishedAtRef = useRef(0);

  useEffect(() => {
    const cleanup = () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      isRunningRef.current = false;

      if (microphoneRef.current) {
        microphoneRef.current.disconnect();
        microphoneRef.current = null;
      }

      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }

      analyserRef.current = null;
      dataArrayRef.current = null;
    };

    if (!stream) {
      cleanup();
      setStatus('idle');
      setIsActive(false);
      setVolume(0);
      setFrequency(0);
      setFrequencyData(new Uint8Array(128));
      return cleanup;
    }

    const windowWithWebkitAudioContext = window as WindowWithWebkitAudioContext;
    const AudioContextClass = globalThis.AudioContext ?? windowWithWebkitAudioContext.webkitAudioContext;

    if (!AudioContextClass) {
      cleanup();
      return cleanup;
    }

    const audioContext = new AudioContextClass();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);

    analyser.smoothingTimeConstant = smoothingTimeConstant;
    analyser.fftSize = fftSize;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    microphone.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    microphoneRef.current = microphone;
    dataArrayRef.current = dataArray;
    isRunningRef.current = true;
    setStatus('active');

    const publishIntervalMs = Math.max(16, Math.floor(1000 / sampleRate));

    const analyze = (timestamp: number) => {
      if (!isRunningRef.current || !analyserRef.current || !dataArrayRef.current) {
        return;
      }

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      if (timestamp - lastPublishedAtRef.current >= publishIntervalMs) {
        // Calculate volume (RMS)
        let sum = 0;
        for (const value of dataArrayRef.current) {
          sum += value * value;
        }
        const rms = Math.sqrt(sum / dataArrayRef.current.length);
        const volumeLevel = Math.min(100, (rms / 128) * 100);

        // Calculate dominant frequency
        let maxIndex = 0;
        let maxValue = 0;
        for (let i = 0;i < dataArrayRef.current.length;i++) {
          const value = dataArrayRef.current[i] ?? 0;
          if (value > maxValue) {
            maxValue = value;
            maxIndex = i;
          }
        }

        const dominantFreq = (maxIndex * audioContext.sampleRate) / (2 * dataArrayRef.current.length);
        const frequencyDataCopy = new Uint8Array(dataArrayRef.current.length);
        frequencyDataCopy.set(dataArrayRef.current);

        setVolume(volumeLevel);
        setFrequency(dominantFreq);
        setIsActive(volumeLevel > threshold);
        setFrequencyData(frequencyDataCopy);

        lastPublishedAtRef.current = timestamp;
      }

      animationFrameRef.current = requestAnimationFrame(analyze);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        return;
      }

      if (animationFrameRef.current === null) {
        animationFrameRef.current = requestAnimationFrame(analyze);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    animationFrameRef.current = requestAnimationFrame(analyze);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cleanup();
    };
  }, [stream, threshold, smoothingTimeConstant, fftSize, sampleRate]);

  return { isActive, volume, frequency, frequencyData, status };
};
