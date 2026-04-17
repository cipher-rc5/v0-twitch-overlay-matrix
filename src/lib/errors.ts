import { Data } from 'effect';

export class MicrophoneNotSupported extends Data.TaggedError('MicrophoneNotSupported') {}

export class MicrophoneDenied extends Data.TaggedError('MicrophoneDenied')<{ readonly message: string }> {}

export class AudioContextNotSupported extends Data.TaggedError('AudioContextNotSupported') {}

export class PermissionQueryNotSupported extends Data.TaggedError('PermissionQueryNotSupported') {}
