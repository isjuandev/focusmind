import type { Metadata } from "next";
import { Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-syne",
});

export const metadata: Metadata = {
  title: "FocusMind – Entrena tu concentración",
  description:
    "FocusMind usa ejercicios gamificados y recordatorios inteligentes para ayudarte a gestionar el TDAH en tu vida diaria.",
  openGraph: {
    title: "FocusMind – Entrena tu concentración",
    description: "Gamificación y apoyo digital para el TDAH.",
    url: "https://focusmind.vercel.app",
    siteName: "FocusMind",
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={syne.variable}>
      <body>{children}</body>
    </html>
  );
}
