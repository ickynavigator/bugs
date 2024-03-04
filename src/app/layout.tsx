import '@mantine/core/styles.css';

import { Analytics } from '@vercel/analytics/next';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { TRPCReactProvider } from '~/trpc/react';
import type { Metadata } from 'next';
import { env } from '~/env';
import { Shell } from './_components/shell';

export const metadata: Metadata = {
  metadataBase: new URL(`https://${env.VERCEL_URL}`),
  title: {
    template: `%s | Bug Tracker`,
    default: `Bug Tracker`,
  },
  keywords: [
    'BUG',
    'BUG TRACKER',
    'ISSUE',
    'ISSUE TRACKER',
    'NEXTJS',
    'REACTJS',
    'MANTINE',
  ],
  robots: 'index, follow',
  description: `Obi Fortune's Bug Tracker. Built with Next.js and Mantine.`,
  creator: 'Obi Fortune',
  authors: [{ name: 'Obi Fortune', url: 'https://obifortune.com' }],
  openGraph: {
    type: 'website',
    title: {
      template: `%s | Bug Tracker`,
      default: `Bug Tracker`,
    },
    description: `Obi Fortune's Bug Tracker. Built with Next.js and Mantine.`,
    url: `/`,
  },
  twitter: {
    card: 'player',
    title: {
      template: `%s | Bug Tracker`,
      default: `Bug Tracker`,
    },
    description: `Obi Fortune's Bug Tracker. Built with Next.js and Mantine.`,
    creator: '@obifortunebleh',
    creatorId: '1467726470533754880',
    site: `/`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>

      <body>
        <TRPCReactProvider>
          <MantineProvider>
            <Shell>{children}</Shell>
          </MantineProvider>
        </TRPCReactProvider>

        <Analytics />
      </body>
    </html>
  );
}
