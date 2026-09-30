import { beforeEach, describe, expect, it, vi } from 'vitest';

const rooms: FakeRoom[] = [];
let participantsAtConnect: FakeParticipant[] = [];

class FakeRoom {
  opts: Record<string, unknown>;
  events = new Map<string, Array<(...args: unknown[]) => void>>();
  calls: string[] = [];
  remoteParticipants = new Map<string, FakeParticipant>();
  localParticipant = {
    setMicrophoneEnabled: vi.fn(async () => {
      this.calls.push('mic');
    }),
  };

  constructor(opts: Record<string, unknown>) {
    this.opts = opts;
    rooms.push(this);
  }

  connect = vi.fn(async () => {
    this.calls.push('connect');
    participantsAtConnect.forEach((participant, index) => {
      this.remoteParticipants.set(`p-${index}`, participant);
    });
  });

  startAudio = vi.fn(async () => {
    this.calls.push('startAudio');
  });

  on = vi.fn((event: string, cb: (...args: unknown[]) => void) => {
    this.calls.push(`on:${event}`);
    const list = this.events.get(event) ?? [];
    list.push(cb);
    this.events.set(event, list);
  });

  disconnect = vi.fn(async () => undefined);
}

class FakeParticipant {
  audioTrackPublications = new Map<string, { track?: FakeTrack }>();
}

class FakeTrack {
  kind: string;
  attach = vi.fn(() => {
    const el = document.createElement('audio');
    el.play = vi.fn(async () => undefined);
    return el;
  });
  detach = vi.fn(() => [] as HTMLMediaElement[]);

  constructor(kind: string) {
    this.kind = kind;
  }
}

vi.mock('livekit-client', () => ({
  Room: FakeRoom,
  Track: { Kind: { Audio: 'audio', Video: 'video' } },
  RoomEvent: {
    TrackSubscribed: 'trackSubscribed',
    TrackUnsubscribed: 'trackUnsubscribed',
    DataReceived: 'dataReceived',
  },
}));

import { createVoiceConnection } from './voice';

beforeEach(() => {
  rooms.length = 0;
  participantsAtConnect = [];
  document.body.innerHTML = '';
});

describe('createVoiceConnection', () => {
  it('plays agent audio on the dual peer connection and attaches tracks that arrive during connect', async () => {
    const agentTrack = new FakeTrack('audio');
    const participant = new FakeParticipant();
    participant.audioTrackPublications.set('agent-voice', { track: agentTrack });
    participantsAtConnect = [participant];

    const conn = await createVoiceConnection({
      url: 'wss://livekit.example',
      token: 'token',
    });

    const room = rooms[0];
    expect(room.opts.singlePeerConnection).toBe(false);
    // The subscribe listener is in place before the socket connects, so a
    // track published while connect() is resolving is not dropped.
    expect(room.calls.indexOf('on:trackSubscribed')).toBeLessThan(
      room.calls.indexOf('connect'),
    );
    expect(room.calls.indexOf('startAudio')).toBeLessThan(room.calls.indexOf('mic'));

    // Already-present remote audio (subscribed inside connect) is attached
    // even without a second TrackSubscribed event.
    expect(agentTrack.attach).toHaveBeenCalledOnce();
    expect(document.querySelector('audio[data-livekit-voice="agent"]')).not.toBeNull();

    // A later subscription of the same track does not attach a second element.
    room.events.get('trackSubscribed')?.[0]?.(agentTrack);
    expect(agentTrack.attach).toHaveBeenCalledOnce();

    await conn.disconnect();
  });

  it('ignores non-audio tracks', async () => {
    const video = new FakeTrack('video');

    await createVoiceConnection({ url: 'wss://livekit.example', token: 'token' });

    // The scan only walks audio publications, so seed a video via the event.
    rooms[0].events.get('trackSubscribed')?.[0]?.(video);
    expect(video.attach).not.toHaveBeenCalled();
    expect(document.querySelector('audio')).toBeNull();
  });
});
