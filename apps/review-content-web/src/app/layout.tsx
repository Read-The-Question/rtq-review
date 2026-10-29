import './globals.css';
import '@rtq/review-paper-browser/styles.css';
import 'katex/dist/katex.min.css';

import type { Metadata } from 'next';
import Script from 'next/script';

import { paperFontVariableClassName } from './fonts';

const themeScript = `
try {
  var theme = localStorage.getItem('rtq-color-theme:v1');
  document.documentElement.dataset.theme = /^(system|light|dark)$/.test(theme || '') ? theme : 'system';
} catch (_) {
  document.documentElement.dataset.theme = 'system';
}
`;

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
    <html
      className={paperFontVariableClassName}
      data-scroll-behavior="smooth"
      data-theme="system"
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <Script id="rtq-theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
