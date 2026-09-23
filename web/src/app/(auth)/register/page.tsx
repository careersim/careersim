import type { Metadata } from 'next';

import { RegisterForm } from '@/components/auth/RegisterForm';
import { metadataFor } from '@/lib/seo';

// The auth layout noindexes every account route. Signup is a public
// entry point, so this page opts back into indexing. robots.txt must
// allow /register as well, or Google never sees this tag.
export const metadata: Metadata = metadataFor({
  title: 'Create account',
  description:
    'Create a careersim account to practice interviews, workplace conversations, and professional scenarios with AI simulations.',
  path: '/register',
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

export default function RegisterPage() {
  return <RegisterForm />;
}
