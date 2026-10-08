import './globals.css';

import '@rtq/review-paper-browser/styles.css';
import 'katex/dist/katex.min.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';

const themeScript = `
try {
  var theme = localStorage.getItem('rtq-color-theme:v1');
  document.documentElement.dataset.theme = /^(system|light|dark)$/.test(theme || '') ? theme : 'system';
} catch (_) {
  document.documentElement.dataset.theme = 'system';
}
`;

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'RTQ Tag Editor',
  description: 'Direct TOML tag editor for RTQ paper tags and inheritance.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-theme="system"
      suppressHydrationWarning>
      <Script id="rtq-theme" strategy="beforeInteractive">
        {themeScript}
      </Script>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
