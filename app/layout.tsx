import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3001'),
  title: 'DAREY | Ajustadores Profesionales',
  description: 'Atención profesional de siniestros y cobertura regional desde San Luis Potosí.',
  openGraph: {
    title: 'DAREY | Ajustadores Profesionales',
    description: 'Respuesta oportuna. Atención humana.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DAREY | Ajustadores Profesionales',
    description: 'Respuesta oportuna. Atención humana.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
