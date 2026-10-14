import React from 'react';
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'REA DEVELOPER STUDIO — Autonomous Multi-Agent & Code Builder',
  description: 'Design, execute, code, and publish autonomous multi-agent workflows and cloud projects powered by Gemini AI.',
  openGraph: {
    title: 'REA DEVELOPER STUDIO',
    description: 'Autonomous multi-agent orchestration and cloud developer workspace.',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'REA DEVELOPER STUDIO',
    description: 'Autonomous multi-agent orchestration and cloud developer workspace.'
  }
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="h-full">
      <body suppressHydrationWarning className="h-full bg-slate-950 text-slate-100 antialiased font-sans selection:bg-indigo-500 selection:text-white">{children}</body>
    </html>
  );
}
