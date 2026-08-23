import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://mexjsa.github.io/darey/'),
  title: 'DAREY Ajustadores Profesionales S.C. | Profesionalismo en movimiento',
  description: 'En DAREY conectamos experiencia, precisión y confianza para brindar soluciones profesionales en ajuste de siniestros. San Luis Potosí, Aguascalientes, BCS y Red Nacional.',
  openGraph: {
    title: 'DAREY Ajustadores Profesionales S.C.',
    description: 'Respuesta oportuna. Atención humana. Profesionalismo en movimiento.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DAREY Ajustadores Profesionales S.C.',
    description: 'Respuesta oportuna. Atención humana. Profesionalismo en movimiento.',
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
