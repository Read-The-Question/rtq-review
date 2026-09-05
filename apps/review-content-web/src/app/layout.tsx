import './globals.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'RTQ Review Content Web',
    template: '%s · RTQ Review Content Web',
  },
  description: 'Direct, read-only review of RTQ paper content.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
