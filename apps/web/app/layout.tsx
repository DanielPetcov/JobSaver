import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'JobTrack', description: 'Personal job-application workbench' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }

