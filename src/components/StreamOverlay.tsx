'use client';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
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
    // Simulate stream status changes for demo
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

  const activateMicrophone = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicrophoneState('error');
      setMicrophoneError('Microphone access is not supported in this browser.');
      return;
    }

    setMicrophoneError(null);
    setMicrophoneState('requesting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });

      releaseMicrophoneStream();
      microphoneStreamRef.current = stream;
      setMicrophoneStream(stream);
      setMicrophoneState('ready');
    } catch {
      setMicrophoneState('denied');
      setMicrophoneError('Microphone access was denied. Enable permission in your browser and try again.');
    }
  }, [releaseMicrophoneStream]);

  useEffect(() => {
    let isMounted = true;

    const initializePermissionState = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setMicrophoneState('error');
        setMicrophoneError('Microphone access is not supported in this browser.');
        return;
      }

      if (!navigator.permissions?.query) {
        setMicrophoneState('prompt');
        return;
      }

      try {
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (!isMounted) return;

        permissionStatusRef.current = permission;

        const syncFromPermission = () => {
          if (permission.state === 'granted') {
            if (microphoneStreamRef.current) {
              setMicrophoneState('ready');
              return;
            }

            void activateMicrophone();
            return;
          }

          if (permission.state === 'denied') {
            releaseMicrophoneStream();
            setMicrophoneState('denied');
            return;
          }

          setMicrophoneState('prompt');
        };

        permission.onchange = syncFromPermission;
        syncFromPermission();
      } catch {
        setMicrophoneState('prompt');
      }
    };

    void initializePermissionState();

    return () => {
      isMounted = false;
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
        <MicrophonePermission state={microphoneState} errorMessage={microphoneError} onRequestPermission={activateMicrophone} />
      )}
    </div>
  );
};

export default StreamOverlay;
