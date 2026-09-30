/**
 * Browser-side voice mode helpers.
 *
 * Thin layer over `livekit-client` plus the kill-switch /
 * configuration handling. Imported by the voice components only — the
 * heavy `livekit-client` wheel is deferred behind a dynamic import in
 * {@link createVoiceConnection} so the rest of the app's bundle stays
 * unaffected when voice is disabled.
 */

import type { VoiceCaption, VoiceControlEvent } from './types';

const CAPTION_TOPIC = 'voice-captions';
const CONTROL_TOPIC = 'voice-control';

export function isVoiceEnabledClientSide(): boolean {
  // Both server- and client-side calls hit the same flag — `process.env`
  // is replaced at build time by Next, so this is a pure boolean.
  const v = process.env.NEXT_PUBLIC_VOICE_ENABLED;
  return v !== 'false' && v !== '0' && v !== undefined;
}

export interface VoiceConnection {
  /** LiveKit Room instance — exposed for advanced UI (audio meters, mute toggle). */
  room: import('livekit-client').Room;
  /** Disconnect, stop publishing, and clean up. Safe to call multiple times. */
  disconnect: () => Promise<void>;
  /**
   * Subscribe to caption frames published by the agent-voice worker.
   * Returns an unsubscribe function.
   */
  onCaption: (cb: (caption: VoiceCaption) => void) => () => void;
  /**
   * Subscribe to control events (quota warning / exhaustion) published
   * by the agent-voice worker. Returns an unsubscribe function.
   */
  onControl: (cb: (event: VoiceControlEvent) => void) => () => void;
}

export interface CreateVoiceConnectionArgs {
  url: string;
  token: string;
  /**
   * Stable participant identity — matches the LiveKit token's
   * `identity`. Useful for the UI to differentiate user vs. AI when
   * subscribing to remote tracks.
   */
  expectedAgentParticipantPrefix?: string;
}

/**
 * Connect to a LiveKit room, publish the user's microphone, and
 * subscribe to the AI agent's audio + caption data channel.
 *
 * Lazy-imports `livekit-client` so the rest of the app doesn't pay
 * the bundle cost when voice is disabled.
 */
export async function createVoiceConnection(
  args: CreateVoiceConnectionArgs,
): Promise<VoiceConnection> {
  const lk = await import('livekit-client');
  const { Room, Track } = lk;

  const room = new Room({
    adaptiveStream: true,
    dynacast: true,
    // livekit-client 2.22 rewrites Opus fmtp on the default single peer
    // connection's recvonly placeholders. 2.19, the last client that
    // played the agent track, did not. Dual peer connections keep the
    // subscriber negotiation that path used when voice was audible.
    singlePeerConnection: false,
    audioCaptureDefaults: {
      // Standard mic capture — LiveKit handles rate negotiation with
      // the SFU. Echo cancellation + noise suppression are the
      // browser defaults; auto-gain reduces the dynamic range a bit
      // but smooths Whisper's accuracy on quiet voices.
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  });

  // Register before connect. A track published while `connect` or
  // `setMicrophoneEnabled` is in flight otherwise fires
  // `TrackSubscribed` with nobody listening, and the agent audio is
  // never attached.
  const attachedAudio = new WeakSet<object>();
  const attachAgentAudio = (track: {
    kind: string;
    attach: () => HTMLMediaElement;
  }) => {
    if (track.kind !== Track.Kind.Audio) return;
    if (attachedAudio.has(track)) return;
    attachedAudio.add(track);
    const audioEl = track.attach();
    audioEl.autoplay = true;
    audioEl.style.display = 'none';
    audioEl.setAttribute('data-livekit-voice', 'agent');
    document.body.appendChild(audioEl);
    void Promise.resolve(audioEl.play()).catch(() => {
      void room.startAudio().catch(() => undefined);
    });
  };

  room.on(lk.RoomEvent.TrackSubscribed, (track) => {
    attachAgentAudio(track);
  });
  room.on(lk.RoomEvent.TrackUnsubscribed, (track) => {
    track.detach().forEach((el) => el.remove());
  });

  await room.connect(args.url, args.token, { autoSubscribe: true });

  // Attach audio that is already on the participant map. The
  // WeakSet above makes this a no-op when TrackSubscribed already ran.
  for (const participant of room.remoteParticipants.values()) {
    for (const publication of participant.audioTrackPublications.values()) {
      if (publication.track) attachAgentAudio(publication.track);
    }
  }

  // Unblock autoplay. The call button's click has already been
  // consumed by the token fetch, so playback has to be started
  // explicitly once the room exists.
  await room.startAudio().catch(() => undefined);
  await room.localParticipant.setMicrophoneEnabled(true);

  const captionListeners = new Set<(caption: VoiceCaption) => void>();
  const controlListeners = new Set<(event: VoiceControlEvent) => void>();

  room.on(lk.RoomEvent.DataReceived, (payload, _participant, _kind, topic) => {
    if (topic !== CAPTION_TOPIC && topic !== CONTROL_TOPIC) return;
    try {
      const text = new TextDecoder().decode(payload);
      const parsed = JSON.parse(text);
      if (topic === CONTROL_TOPIC) {
        for (const cb of controlListeners) cb(parsed as VoiceControlEvent);
      } else {
        for (const cb of captionListeners) cb(parsed as VoiceCaption);
      }
    } catch {
      // Drop malformed frames silently — captions/control are best-effort UX.
    }
  });

  let disconnected = false;
  const disconnect = async () => {
    if (disconnected) return;
    disconnected = true;
    try {
      await room.disconnect();
    } catch {
      // Best-effort — the SFU may already have closed the stream.
    }
  };

  const onCaption = (cb: (caption: VoiceCaption) => void) => {
    captionListeners.add(cb);
    return () => captionListeners.delete(cb);
  };

  const onControl = (cb: (event: VoiceControlEvent) => void) => {
    controlListeners.add(cb);
    return () => controlListeners.delete(cb);
  };

  return { room, disconnect, onCaption, onControl };
}
