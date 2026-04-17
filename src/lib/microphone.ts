import { Effect } from 'effect';
import { MicrophoneDenied, MicrophoneNotSupported, PermissionQueryNotSupported } from './errors';

export const acquireStream: Effect.Effect<MediaStream, MicrophoneNotSupported | MicrophoneDenied> = Effect
  .gen(function*() {
    if (!navigator.mediaDevices?.getUserMedia) {
      return yield* Effect.fail(new MicrophoneNotSupported());
    }

    return yield* Effect.tryPromise({
      try: () =>
        navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
        }),
      catch: () =>
        new MicrophoneDenied({
          message: 'Microphone access was denied. Enable permission in your browser and try again.'
        })
    });
  });

export const queryPermissionStatus: Effect.Effect<PermissionStatus, PermissionQueryNotSupported> = Effect.gen(
  function*() {
    if (!navigator.permissions?.query) {
      return yield* Effect.fail(new PermissionQueryNotSupported());
    }

    return yield* Effect.tryPromise({
      try: () => navigator.permissions.query({ name: 'microphone' as PermissionName }),
      catch: () => new PermissionQueryNotSupported()
    });
  }
);
