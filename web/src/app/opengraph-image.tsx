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
import { SITE_NAME } from '@/lib/seo';

export const alt = `${SITE_NAME} — rehearse interviews, negotiations, and tough 1:1s with AI personas`;
export const size = OG_SIZE;
export const contentType = 'image/png';

function ScoreBar({
  label,
  value,
  fill,
}: {
  label: string;
  value: number;
  fill: string;
}) {
  return (
    <div style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
      <div
        style={{
          display: 'flex',
          flexShrink: 0,
          fontFamily: 'JetBrains Mono',
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          width: 112,
        }}
      >
        {label}
      </div>
      <div
        style={{
          background: c.paper,
          border: `2px solid ${c.ink}`,
          display: 'flex',
          height: 16,
          width: 214,
        }}
      >
        <div
          style={{
            background: fill,
            borderRight: `2px solid ${c.ink}`,
            display: 'flex',
            height: '100%',
            width: Math.round((210 * value) / 100),
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexShrink: 0,
          fontFamily: 'JetBrains Mono',
          fontSize: 17,
          fontWeight: 700,
          justifyContent: 'flex-end',
          width: 30,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function SessionPreview() {
  return (
    <OgWindow title="negotiation · round 02 / 05">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          padding: '20px 22px 24px',
        }}
      >
        <div style={{ alignItems: 'center', display: 'flex', gap: 14 }}>
          <div
            style={{
              alignItems: 'center',
              background: c.pink,
              border: `3px solid ${c.ink}`,
              borderRadius: 999,
              boxShadow: `3px 3px 0 ${c.ink}`,
              color: c.surface,
              display: 'flex',
              fontSize: 20,
              fontWeight: 800,
              height: 54,
              justifyContent: 'center',
              width: 54,
            }}
          >
            BV
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 22, fontWeight: 800 }}>
              Brenda Vance
            </div>
            <div
              style={{
                color: c.inkSoft,
                display: 'flex',
                fontSize: 17,
                fontWeight: 500,
              }}
            >
              HR manager · risk-averse
            </div>
          </div>
        </div>

        <div
          style={{
            background: c.softBlue,
            border: `2px solid ${c.ink}`,
            boxShadow: `3px 3px 0 ${c.ink}`,
            display: 'flex',
            fontSize: 19,
            fontWeight: 500,
            lineHeight: 1.35,
            padding: '12px 14px',
          }}
        >
          “Your offer is already at the top of our band. Why is an adjustment
          warranted?”
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div
            style={{
              color: c.inkSoft,
              display: 'flex',
              fontFamily: 'JetBrains Mono',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Live feedback snapshot
          </div>
          <ScoreBar label="Clarity" value={86} fill={c.cyan} />
          <ScoreBar label="Confidence" value={78} fill={c.yellow} />
          <ScoreBar label="Evidence" value={91} fill={c.pink} />
        </div>
      </div>
    </OgWindow>
  );
}

export default async function Image() {
  return new ImageResponse(
    (
      <OgLayout
        tagline="Free start · Open source · MIT"
        headline={[
          <Word key="rehearse">Rehearse</Word>,
          <Highlight key="interviews" background={c.yellow} rotate={-1.2}>
            interviews,
          </Highlight>,
          <Highlight key="negotiations" background={c.cyan} rotate={0.8}>
            negotiations,
          </Highlight>,
          <Word key="and">and</Word>,
          <Highlight
            key="tough"
            background={c.pink}
            color={c.surface}
            rotate={-0.6}
          >
            tough 1:1s
          </Highlight>,
          <Word key="before">— before they happen.</Word>,
        ]}
        chips={['No credit card', 'Voice + text', 'Scored coaching']}
        visual={<SessionPreview />}
      />
    ),
    {
      ...OG_SIZE,
      fonts: await loadOgFonts(),
    },
  );
}
