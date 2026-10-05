import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { ReactNode } from 'react';

import { SITE_NAME } from '@/lib/seo';

export const OG_SIZE = {
  width: 1200,
  height: 630,
};

export const ogColors = {
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
  softPink: '#ffe1ee',
  softLime: '#eaf7c8',
  red: '#ef4444',
};

const c = ogColors;

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

export function loadOgFonts() {
  return Promise.all(
    fontFiles.map(async ({ name, weight, file }) => ({
      name,
      weight,
      style: 'normal' as const,
      data: await readFile(join(process.cwd(), 'node_modules', file)),
    })),
  );
}

export function Highlight({
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

export function Word({ children }: { children: string }) {
  return <div style={{ display: 'flex' }}>{children}</div>;
}

export function Headline({
  children,
  fontSize = 56,
}: {
  children: ReactNode;
  fontSize?: number;
}) {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        fontSize,
        fontWeight: 800,
        letterSpacing: '-0.05em',
        lineHeight: 1.1,
        rowGap: 12,
        columnGap: 14,
      }}
    >
      {children}
    </div>
  );
}

export function MetaChip({ label }: { label: string }) {
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

export function MetaChips({ labels }: { labels: string[] }) {
  return (
    <div style={{ display: 'flex', gap: 14 }}>
      {labels.map((label) => (
        <MetaChip key={label} label={label} />
      ))}
    </div>
  );
}

/** Retro app window with traffic-light dots and a mono title bar. */
export function OgWindow({
  title,
  children,
  width = 430,
}: {
  title: string;
  children: ReactNode;
  width?: number;
}) {
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
        width,
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
          {title}
        </div>
      </div>
      {children}
    </div>
  );
}

function OgHeader({ tagline }: { tagline: string }) {
  return (
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
        {tagline}
      </div>
    </div>
  );
}

/** Landing-hero layout: dark header bar, paper grid, copy left, visual right. */
export function OgLayout({
  tagline,
  headline,
  chips,
  visual,
}: {
  tagline: string;
  headline: ReactNode;
  chips: string[];
  visual: ReactNode;
}) {
  return (
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
      <OgHeader tagline={tagline} />
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
          <Headline>{headline}</Headline>
          <MetaChips labels={chips} />
        </div>
        {visual}
      </div>
    </div>
  );
}
