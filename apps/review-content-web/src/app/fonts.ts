import { Besley, Source_Sans_3 } from 'next/font/google';

// Loaded as on RTQ web (apps/web/src/app/design/fonts/fonts.ts), so paper text
// reads in the production faces: Besley for the serif voices, Source Sans 3
// for the sans ones. globals.css maps them to --rtq-font-title/--rtq-font-body.
const besley = Besley({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-besley',
});

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-source-sans-3',
});

export const paperFontVariableClassName = [
  besley.variable,
  sourceSans3.variable,
].join(' ');
