import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Press_Start_2P } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const bahnschrift = localFont({
  src: "../public/fonts/bahnschrift.ttf",
  variable: "--font-bahnschrift",
  display: "swap",
});

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

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

import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${jetbrainsMono.variable} ${bahnschrift.variable} ${pressStart.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                if (window.innerWidth >= 768) return;

                var LOOP_END   = 10;
                var ZOOM_START = 10;
                var ZOOM_END   = 15;
                var LERP       = 0.14;

                function setup() {
                  var video   = document.querySelector('.hero-video-mobile');
                  var content = document.getElementById('hero-content');
                  var overlay = document.getElementById('hero-overlay');
                  if (!video || !content || !overlay) { setTimeout(setup, 100); return; }

                  var historia = document.getElementById('historia-mobile');

                  var VH             = window.innerHeight;
                  var targetProgress = 0;
                  var lerpProgress   = 0;

                  function tryPlay() { try { video.play(); } catch(e){} }
                  tryPlay();

                  requestAnimationFrame(function tick() {
                    lerpProgress += (targetProgress - lerpProgress) * LERP;
                    if (Math.abs(targetProgress - lerpProgress) < 0.0008) lerpProgress = targetProgress;

                    var p = lerpProgress;

                    var alpha = Math.max(0, 1 - p / 0.3);
                    content.style.opacity    = String(alpha);
                    content.style.visibility = alpha > 0 ? 'visible' : 'hidden';

                    var oa = Math.max(0, Math.min(1, (p - 0.75) / 0.25));
                    overlay.style.opacity    = String(oa);
                    overlay.style.visibility = oa > 0 ? 'visible' : 'hidden';

                    if (historia) historia.style.opacity = String(Math.max(0, Math.min(1, (p - 0.75) / 0.25)));

                    if (p > 0.002) {
                      var t = ZOOM_START + p * (ZOOM_END - ZOOM_START);
                      if (Math.abs(video.currentTime - t) > 0.016) video.currentTime = t;
                      if (!video.paused) video.pause();
                    } else {
                      if (video.currentTime >= LOOP_END) video.currentTime = 0;
                      if (video.paused) tryPlay();
                    }

                    requestAnimationFrame(tick);
                  });

                  var snapTimer;
                  window.addEventListener('scroll', function() {
                    targetProgress = Math.min(1, Math.max(0, window.scrollY / VH));

                    clearTimeout(snapTimer);
                    if (window.scrollY > 0 && window.scrollY < VH) {
                      snapTimer = setTimeout(function() {
                        var pp = window.scrollY / VH;
                        if (pp > 0 && pp < 1) {
                          window.scrollTo({ top: pp >= 0.5 ? VH : 0, behavior: 'smooth' });
                        }
                      }, 200);
                    }

                  }, { passive: true });
                }

                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', setup);
                } else {
                  setup();
                }
              })();
            `,
          }}
        />
        <Script id="scroll-restoration" strategy="beforeInteractive">
          {`history.scrollRestoration='manual';window.addEventListener('pageshow',function(){window.scrollTo(0,0);});window.addEventListener('beforeunload',function(){window.scrollTo(0,0);});`}
        </Script>
<ScrollToTop />
        <Navbar />
        <main>{children}</main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
