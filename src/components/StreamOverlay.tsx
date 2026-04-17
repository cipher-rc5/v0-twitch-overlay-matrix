'use client';
import { Effect, Fiber } from 'effect';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { acquireStream, queryPermissionStatus } from '../lib/microphone';
import CornerBrackets from './CornerBrackets';
import Header from './Header';
import MatrixBackground from './MatrixBackground';
import MicrophonePermission from './MicrophonePermission';
import SideCards from './SideCards';
import StreamStatus from './StreamStatus';
import VoiceReactiveAvatar from './VoiceReactiveAvatar';

type MicrophoneState = 'checking' | 'prompt' | 'requesting' | 'ready' | 'denied' | 'error';

const StreamOverlay: React.FC = () => {
  const [isLive, setIsLive] = useState(false);
  const [streamStatus, setStreamStatus] = useState<'starting' | 'live' | 'offline'>('starting');
  const [microphoneState, setMicrophoneState] = useState<MicrophoneState>('checking');
  const [microphoneError, setMicrophoneError] = useState<string | null>(null);
  const [microphoneStream, setMicrophoneStream] = useState<MediaStream | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const permissionStatusRef = useRef<PermissionStatus | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStreamStatus('live');
      setIsLive(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    microphoneStreamRef.current = microphoneStream;
  }, [microphoneStream]);

  const releaseMicrophoneStream = useCallback((clearState = true) => {
    if (!microphoneStreamRef.current) return;

    for (const track of microphoneStreamRef.current.getTracks()) {
      track.stop();
    }

    microphoneStreamRef.current = null;
    if (clearState) {
      setMicrophoneStream(null);
    }
  }, []);

  const activateMicrophone = useCallback(() => {
    setMicrophoneError(null);
    setMicrophoneState('requesting');

    Effect.runFork(acquireStream.pipe(
      Effect.tap((stream) =>
        Effect.sync(() => {
          releaseMicrophoneStream();
          microphoneStreamRef.current = stream;
          setMicrophoneStream(stream);
          setMicrophoneState('ready');
        })
      ),
      Effect.catchTag('MicrophoneNotSupported', () =>
        Effect.sync(() => {
          setMicrophoneState('error');
          setMicrophoneError('Microphone access is not supported in this browser.');
        })),
      Effect.catchTag('MicrophoneDenied', (e) =>
        Effect.sync(() => {
          setMicrophoneState('denied');
          setMicrophoneError(e.message);
        }))
    ));
  }, [releaseMicrophoneStream]);

  useEffect(() => {
    let isMounted = true;

    const program = Effect.gen(function*() {
      if (!navigator.mediaDevices?.getUserMedia) {
        yield* Effect.sync(() => {
          setMicrophoneState('error');
          setMicrophoneError('Microphone access is not supported in this browser.');
        });
        return;
      }

      yield* queryPermissionStatus.pipe(
        Effect.tap((permission) =>
          Effect.sync(() => {
            if (!isMounted) return;
            permissionStatusRef.current = permission;

            const sync = () => {
              if (!isMounted) return;

              if (permission.state === 'granted') {
                if (!microphoneStreamRef.current) {
                  activateMicrophone();
                } else {
                  setMicrophoneState('ready');
                }
                return;
              }

              if (permission.state === 'denied') {
                releaseMicrophoneStream();
                setMicrophoneState('denied');
                return;
              }

              setMicrophoneState('prompt');
            };

            permission.onchange = sync;
            sync();
          })
        ),
        Effect.catchTag('PermissionQueryNotSupported', () =>
          Effect.sync(() => {
            if (isMounted) setMicrophoneState('prompt');
          }))
      );
    });

    const fiber = Effect.runFork(program);

    return () => {
      isMounted = false;
      Effect.runFork(Fiber.interrupt(fiber));
      if (permissionStatusRef.current) {
        permissionStatusRef.current.onchange = null;
        permissionStatusRef.current = null;
      }
      releaseMicrophoneStream(false);
    };
  }, [activateMicrophone, releaseMicrophoneStream]);

  return (
    <div className='overlay-container'>
      <MatrixBackground opacity={0.12} speed={60} fontSize={16} color='#00ff41' />

      <CornerBrackets />
      <Header />
      <SideCards />
      <StreamStatus status={streamStatus} />
      <VoiceReactiveAvatar isLive={isLive} stream={microphoneStream} />

      {microphoneState !== 'ready' && (
        <MicrophonePermission
          state={microphoneState}
          errorMessage={microphoneError}
          onRequestPermission={activateMicrophone} />
      )}
    </div>
  );
};

export default StreamOverlay;
