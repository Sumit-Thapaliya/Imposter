import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Imposter Game',
  description: 'Guess · Draw · Find the Imposter!',
  applicationName: 'Imposter Game',
  /**
   * The mask icon comes from `app/icon.svg`, the iPhone bookmark icon from
   * `app/apple-icon.png`, and the link-preview card from `app/opengraph-image.png`.
   * Next serves all three and writes the <link>/<meta> tags itself — declaring them
   * here as well would duplicate every tag.
   */
  openGraph: {
    title: 'Imposter Game',
    description: 'Guess · Draw · Find the Imposter!',
    type: 'website',
    siteName: 'Imposter Game',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Imposter Game',
    description: 'Guess · Draw · Find the Imposter!',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#150a2e',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
