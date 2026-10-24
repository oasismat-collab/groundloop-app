import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Groundwork — small scraps, living soil', description: 'Explore how fruit scraps can contribute to soil through compost, with transparent evidence and assumptions.' };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
