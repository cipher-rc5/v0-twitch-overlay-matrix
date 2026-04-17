import { type Metadata } from 'next';
import type React from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cipher Twitch Overlay',
  description: 'Responsive animated Twitch streaming overlay for ultrawide monitors',
  generator: 'ℭ𝔦𝔭𝔥𝔢𝔯'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link
          rel='preload'
          href='/fonts/Terminess-Nerd-Font-Complete-Mono.ttf'
          as='font'
          type='font/ttf'
          crossOrigin='anonymous' />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
