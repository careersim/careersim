import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

import { SITE_NAME } from '@/lib/seo';

export const alt = `${SITE_NAME} — rehearse interviews, negotiations, and tough 1:1s with AI personas`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

const c = {
  paper: '#fffdf5',
  surface: '#ffffff',
  ink: '#111827',
  inkSoft: '#4b5563',
  yellow: '#fbbf24',
  cyan: '#22d3ee',
  pink: '#ec4899',
  lime: '#84cc16',
  green: '#0fb980',
  softBlue: '#d6f2ff',
  softYellow: '#fff6c2',
  softLime: '#eaf7c8',
  red: '#ef4444',
};

// Satori only reads ttf/otf/woff, so these come from the static
// @fontsource packages rather than the variable woff2 used by the app.
const fontFiles = [
  { name: 'Inter', weight: 500, file: '@fontsource/inter/files/inter-latin-500-normal.woff' },
  { name: 'Inter', weight: 700, file: '@fontsource/inter/files/inter-latin-700-normal.woff' },
  { name: 'Inter', weight: 800, file: '@fontsource/inter/files/inter-latin-800-normal.woff' },
  { name: 'JetBrains Mono', weight: 500, file: '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff' },
  { name: 'JetBrains Mono', weight: 700, file: '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff' },
  { name: 'Press Start 2P', weight: 400, file: '@fontsource/press-start-2p/files/press-start-2p-latin-400-normal.woff' },
] as const;

function loadFonts() {
  return Promise.all(
    fontFiles.map(async ({ name, weight, file }) => ({
      name,
      weight,
      style: 'normal' as const,
      data: await readFile(join(process.cwd(), 'node_modules', file)),
    })),
  );
}

function Highlight({
  children,
  background,
  color = c.ink,
  rotate,
}: {
  children: string;
  background: string;
  color?: string;
  rotate: number;
}) {
  return (
    <div
      style={{
        background,
        border: `3px solid ${c.ink}`,
        boxShadow: `4px 4px 0 ${c.ink}`,
        color,
        display: 'flex',
        padding: '0 12px',
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {children}
    </div>
  );
}

function MetaChip({ label }: { label: string }) {
  return (
    <div
      style={{
        alignItems: 'center',
        background: c.surface,
        border: `2px solid ${c.ink}`,
        boxShadow: `3px 3px 0 ${c.ink}`,
        display: 'flex',
        flexShrink: 0,
        fontFamily: 'JetBrains Mono',
        fontSize: 15,
        fontWeight: 500,
        gap: 9,
        letterSpacing: '0.04em',
        padding: '8px 12px',
        textTransform: 'uppercase',
      }}
    >
      <div
        style={{
          alignItems: 'center',
          background: c.lime,
          border: `2px solid ${c.ink}`,
          borderRadius: 999,
          display: 'flex',
          height: 20,
          justifyContent: 'center',
          width: 20,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path
            d="M2 6.5 L5 9 L10 3"
            fill="none"
            stroke={c.ink}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {label}
    </div>
  );
}

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
    <div
      style={{
        background: c.surface,
        border: `3px solid ${c.ink}`,
        boxShadow: `10px 10px 0 ${c.ink}`,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        transform: 'rotate(1.2deg)',
        width: 430,
      }}
    >
      <div
        style={{
          alignItems: 'center',
          background: c.softYellow,
          borderBottom: `3px solid ${c.ink}`,
          display: 'flex',
          gap: 8,
          padding: '12px 16px',
        }}
      >
        {[c.red, c.yellow, c.green].map((dot) => (
          <div
            key={dot}
            style={{
              background: dot,
              border: `2px solid ${c.ink}`,
              borderRadius: 999,
              display: 'flex',
              height: 14,
              width: 14,
            }}
          />
        ))}
        <div
          style={{
            display: 'flex',
            fontFamily: 'JetBrains Mono',
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.06em',
            marginLeft: 8,
            textTransform: 'uppercase',
          }}
        >
          negotiation · round 02 / 05
        </div>
      </div>

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
    </div>
  );
}

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: c.paper,
          color: c.ink,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Inter',
          height: '100%',
          width: '100%',
        }}
      >
        <div
          style={{
            alignItems: 'center',
            background: c.ink,
            color: c.paper,
            display: 'flex',
            height: 78,
            justifyContent: 'space-between',
            padding: '0 56px',
          }}
        >
          <div style={{ alignItems: 'center', display: 'flex', gap: 18 }}>
            <div
              style={{
                display: 'flex',
                fontFamily: 'Press Start 2P',
                fontSize: 22,
                letterSpacing: '0.08em',
              }}
            >
              {SITE_NAME}
            </div>
            <div
              style={{
                alignItems: 'center',
                background: c.softLime,
                border: `2px solid ${c.paper}`,
                borderRadius: 999,
                color: c.ink,
                display: 'flex',
                fontFamily: 'JetBrains Mono',
                fontSize: 14,
                fontWeight: 500,
                gap: 8,
                letterSpacing: '0.06em',
                padding: '5px 12px 5px 10px',
                textTransform: 'uppercase',
              }}
            >
              <div
                style={{
                  background: c.green,
                  border: `1.5px solid ${c.ink}`,
                  borderRadius: 999,
                  display: 'flex',
                  height: 10,
                  width: 10,
                }}
              />
              Live
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontFamily: 'JetBrains Mono',
              fontSize: 16,
              fontWeight: 500,
              letterSpacing: '0.06em',
              opacity: 0.8,
              textTransform: 'uppercase',
            }}
          >
            Free start · Open source · MIT
          </div>
        </div>

        <div
          style={{
            alignItems: 'center',
            backgroundImage:
              'linear-gradient(rgba(17, 24, 39, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(17, 24, 39, 0.07) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            borderTop: `3px solid ${c.ink}`,
            display: 'flex',
            flexGrow: 1,
            gap: 40,
            justifyContent: 'space-between',
            padding: '0 64px 0 56px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 36,
              width: 600,
            }}
          >
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                flexWrap: 'wrap',
                fontSize: 56,
                fontWeight: 800,
                letterSpacing: '-0.05em',
                lineHeight: 1.1,
                rowGap: 12,
                columnGap: 14,
              }}
            >
              <div style={{ display: 'flex' }}>Rehearse</div>
              <Highlight background={c.yellow} rotate={-1.2}>
                interviews,
              </Highlight>
              <Highlight background={c.cyan} rotate={0.8}>
                negotiations,
              </Highlight>
              <div style={{ display: 'flex' }}>and</div>
              <Highlight background={c.pink} color={c.surface} rotate={-0.6}>
                tough 1:1s
              </Highlight>
              <div style={{ display: 'flex' }}>— before they happen.</div>
            </div>

            <div style={{ display: 'flex', gap: 14 }}>
              <MetaChip label="No credit card" />
              <MetaChip label="Voice + text" />
              <MetaChip label="Scored coaching" />
            </div>
          </div>

          <SessionPreview />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: await loadFonts(),
    },
  );
}
