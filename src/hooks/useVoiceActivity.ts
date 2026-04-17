'use client';
import { Effect, Fiber } from 'effect';
import { useEffect, useState } from 'react';
import { makeScopedAudioContext } from '../lib/audio';

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

export const useVoiceActivity = (options: VoiceActivityOptions): VoiceActivityData => {
  const { stream, threshold = 30, smoothingTimeConstant = 0.8, fftSize = 256, sampleRate = 30 } = options;

  const [isActive, setIsActive] = useState(false);
  const [volume, setVolume] = useState(0);
  const [frequency, setFrequency] = useState(0);
  const [frequencyData, setFrequencyData] = useState<Uint8Array<ArrayBuffer>>(new Uint8Array(128));
  const [status, setStatus] = useState<'idle' | 'active'>('idle');

  useEffect(() => {
    if (!stream) {
      setStatus('idle');
      setIsActive(false);
      setVolume(0);
      setFrequency(0);
      setFrequencyData(new Uint8Array(128));
      return;
    }

    const program = Effect.gen(function*() {
      const audioContext = yield* makeScopedAudioContext;

      const analyser = yield* Effect.sync(() => {
        const a = audioContext.createAnalyser();
        a.smoothingTimeConstant = smoothingTimeConstant;
        a.fftSize = fftSize;
        return a;
      });

      yield* Effect.acquireRelease(
        Effect.sync(() => {
          const m = audioContext.createMediaStreamSource(stream);
          m.connect(analyser);
          return m;
        }),
        (m) => Effect.sync(() => m.disconnect())
      );

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const publishIntervalMs = Math.max(16, Math.floor(1000 / sampleRate));

      yield* Effect.sync(() => setStatus('active'));

      yield* Effect.async<never, never, never>((resume) => {
        let animFrameId: number | null = null;
        let lastPublishedAt = 0;
        let isRunning = true;

        const analyze = (timestamp: number) => {
          if (!isRunning) return;

          analyser.getByteFrequencyData(dataArray);

          if (timestamp - lastPublishedAt >= publishIntervalMs) {
            let sum = 0;
            for (const value of dataArray) sum += value * value;
            const rms = Math.sqrt(sum / dataArray.length);
            const volumeLevel = Math.min(100, (rms / 128) * 100);

            let maxIndex = 0;
            let maxValue = 0;
            for (let i = 0;i < dataArray.length;i++) {
              const val = dataArray[i] ?? 0;
              if (val > maxValue) {
                maxValue = val;
                maxIndex = i;
              }
            }

            const dominantFreq = (maxIndex * audioContext.sampleRate) / (2 * dataArray.length);
            const copy = new Uint8Array(dataArray.length);
            copy.set(dataArray);

            setVolume(volumeLevel);
            setFrequency(dominantFreq);
            setIsActive(volumeLevel > threshold);
            setFrequencyData(copy);
            lastPublishedAt = timestamp;
          }

          animFrameId = requestAnimationFrame(analyze);
        };

        const handleVisibilityChange = () => {
          if (document.visibilityState === 'hidden') {
            if (animFrameId !== null) {
              cancelAnimationFrame(animFrameId);
              animFrameId = null;
            }
          } else if (animFrameId === null && isRunning) {
            animFrameId = requestAnimationFrame(analyze);
          }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        animFrameId = requestAnimationFrame(analyze);

        return Effect.sync(() => {
          isRunning = false;
          if (animFrameId !== null) cancelAnimationFrame(animFrameId);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        });
      });
    }).pipe(
      Effect.scoped,
      Effect.catchTag('AudioContextNotSupported', () => Effect.sync(() => setStatus('idle')))
    );

    const fiber = Effect.runFork(program);

    return () => {
      Effect.runFork(Fiber.interrupt(fiber));
    };
  }, [stream, threshold, smoothingTimeConstant, fftSize, sampleRate]);

  return { isActive, volume, frequency, frequencyData, status };
};
