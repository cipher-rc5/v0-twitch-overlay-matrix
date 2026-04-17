import { Effect, Scope } from 'effect';
import { AudioContextNotSupported } from './errors';

type WindowWithWebkit = Window & { webkitAudioContext?: typeof AudioContext };

export const makeScopedAudioContext: Effect.Effect<AudioContext, AudioContextNotSupported, Scope.Scope> =
  Effect.acquireRelease(
    Effect.try({
      try: () => {
        const AudioCtx = globalThis.AudioContext ?? (window as WindowWithWebkit).webkitAudioContext;
        if (!AudioCtx) throw new Error('AudioContext not supported');
        return new AudioCtx();
      },
      catch: () => new AudioContextNotSupported()
    }),
    (ctx) => Effect.promise(() => ctx.close())
  );
