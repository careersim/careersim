import { ImageResponse } from 'next/og';

import {
  Highlight,
  OG_SIZE,
  OgLayout,
  OgWindow,
  Word,
  loadOgFonts,
  ogColors as c,
} from '@/lib/og';

// Served for the Astro `/business` page, which can't use Next's
// opengraph-image convention because it lives in the landing project.
export const dynamic = 'force-static';

const feed = [
  {
    agent: 'Support agent',
    action: 'drafted a reply',
    target: 'ticket #4821 · refund dispute',
    dot: c.yellow,
  },
  {
    agent: 'Coach agent',
    action: 'scored a session',
    target: 'discovery call · new-hire ramp',
    dot: c.cyan,
  },
  {
    agent: 'Content agent',
    action: 'drafted a post',
    target: 'launch notes · in your brand voice',
    dot: c.pink,
  },
  {
    agent: 'Support agent',
    action: 'resolved',
    target: 'ticket #4790 · password reset',
    dot: c.green,
  },
];

function AgentFeed() {
  return (
    <OgWindow title="your-team.agents — live" width={450}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {feed.map((item, index) => (
          <div
            key={item.target}
            style={{
              alignItems: 'center',
              borderTop: index === 0 ? 'none' : `2px solid ${c.ink}`,
              display: 'flex',
              gap: 14,
              padding: '14px 18px',
            }}
          >
            <div
              style={{
                background: item.dot,
                border: `2px solid ${c.ink}`,
                borderRadius: 999,
                display: 'flex',
                flexShrink: 0,
                height: 16,
                width: 16,
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                gap: 3,
              }}
            >
              <div style={{ display: 'flex', fontSize: 18, gap: 6 }}>
                <span style={{ fontWeight: 800 }}>{item.agent}</span>
                <span style={{ fontWeight: 500 }}>{item.action}</span>
              </div>
              <div
                style={{
                  color: c.inkSoft,
                  display: 'flex',
                  fontFamily: 'JetBrains Mono',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {item.target}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          alignItems: 'center',
          background: c.ink,
          color: c.paper,
          display: 'flex',
          fontFamily: 'JetBrains Mono',
          fontSize: 13,
          fontWeight: 500,
          gap: 10,
          letterSpacing: '0.06em',
          padding: '11px 18px',
          textTransform: 'uppercase',
        }}
      >
        <div
          style={{
            background: c.red,
            border: `1.5px solid ${c.paper}`,
            borderRadius: 999,
            display: 'flex',
            height: 10,
            width: 10,
          }}
        />
        Agents working · human review on
      </div>
    </OgWindow>
  );
}

export async function GET() {
  return new ImageResponse(
    (
      <OgLayout
        tagline="For teams · Custom builds · Pilot-first"
        headline={[
          ...("Your team's newest hire is an".split(' ').map((word) => (
            <Word key={word}>{word}</Word>
          ))),
          <Highlight key="agent" background={c.yellow} rotate={-1.2}>
            AI agent
          </Highlight>,
          <Word key="dash">—</Word>,
          <Highlight
            key="grounded"
            background={c.pink}
            color={c.surface}
            rotate={-0.6}
          >
            grounded
          </Highlight>,
          <Word key="data">in your data.</Word>,
        ]}
        chips={['Pilot in weeks', 'Your data', 'Human review']}
        visual={<AgentFeed />}
      />
    ),
    {
      ...OG_SIZE,
      fonts: await loadOgFonts(),
    },
  );
}
