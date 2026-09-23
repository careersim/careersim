import type { Metadata } from 'next';

import { LoginForm } from '@/components/auth/LoginForm';
import { metadataFor } from '@/lib/seo';

// The auth layout noindexes every account route. Sign-in is a public
// entry point, so this page opts back into indexing. robots.txt must
// allow /login as well, or Google never sees this tag.
export const metadata: Metadata = metadataFor({
  title: 'Sign in',
  description:
    'Sign in to careersim to continue interview practice, workplace conversations, and professional scenarios with AI simulations.',
  path: '/login',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
});

export default function LoginPage() {
  return <LoginForm />;
}
