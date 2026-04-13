import type { Metadata } from "next";
import { JetBrains_Mono, Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
  display: "swap",
});

export const metadata: Metadata = {
  title: "20 [CREATECA] 26 — Developing Brand Through A New World Vision",
  description:
    "Agencia de desarrollo de marca y marketing estratégico. La creatividad sin estructura es solo ruido.",
  keywords: ["branding", "marketing estratégico", "identidad visual", "agencia", "México"],
  openGraph: {
    title: "20 [CREATECA] 26",
    description: "Developing Brand Through A New World Vision",
    siteName: "CREATECA",
    locale: "es_MX",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${jetbrainsMono.variable} ${inter.variable} ${pressStart.variable}`}>
      <body>
        <ScrollToTop />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
