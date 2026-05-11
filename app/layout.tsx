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

                  var VH             = window.innerHeight;
                  var heroDone       = false;
                  var targetProgress = 0;
                  var lerpProgress   = 0;

                  function tryPlay() { try { video.play(); } catch(e){} }
                  tryPlay();

                  /* ── RAF loop ── */
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

                    if (p > 0.002) {
                      var t = ZOOM_START + p * (ZOOM_END - ZOOM_START);
                      if (Math.abs(video.currentTime - t) > 0.016) video.currentTime = t;
                      if (!video.paused) video.pause();
                    } else {
                      if (video.currentTime >= LOOP_END) video.currentTime = 0;
                      if (video.paused) tryPlay();
                    }

                    /* historia fade-out when scrolling back into hero zone */
                    if (p < 1 && window.scrollY < VH) {
                      var hist = document.getElementById('historia-mobile');
                      if (hist && hist.style.visibility !== 'hidden') {
                        var ha = Math.min(1, Math.max(0, (p - 0.7) / 0.3));
                        hist.style.transition = 'none';
                        hist.style.opacity    = String(ha);
                        if (ha <= 0) {
                          hist.style.visibility = 'hidden';
                          heroDone = false;
                        }
                      }
                    }

                    requestAnimationFrame(tick);
                  });

                  /* ── Scroll handler ── */
                  var snapTimer;
                  window.addEventListener('scroll', function() {
                    targetProgress = Math.min(1, Math.max(0, window.scrollY / VH));

                    /* historia-inner translateY — always tracks scroll */
                    var inner = document.getElementById('historia-inner');
                    if (inner) {
                      inner.style.transform = 'translateY(' + (window.scrollY >= VH ? VH - window.scrollY : 0) + 'px)';
                    }

                    /* snap to 0 or VH when scroll rests in hero zoom zone */
                    clearTimeout(snapTimer);
                    if (window.scrollY <= VH) {
                      snapTimer = setTimeout(function() {
                        var pp = window.scrollY / VH;
                        if (pp > 0 && pp < 1) {
                          window.scrollTo({ top: pp >= 0.5 ? VH : 0, behavior: 'smooth' });
                        }
                      }, 200);
                    }

                    /* show historia once hero zoom completes */
                    if (targetProgress >= 1 && !heroDone) {
                      heroDone = true;
                      clearTimeout(snapTimer);
                      var hist = document.getElementById('historia-mobile');
                      if (!hist) return;
                      hist.style.transition = 'none';
                      hist.style.visibility = 'visible';
                      hist.style.opacity    = '0';
                      requestAnimationFrame(function(){ requestAnimationFrame(function(){
                        hist.style.transition = 'opacity 0.8s ease';
                        hist.style.opacity    = '1';
                      }); });
                    }

                    /* hide historia only once servicios fully covers the viewport (srvTop <= 0)
                       — no fades, servicios z-index:50 scrolls over historia z-index:40 naturally */
                    if (heroDone) {
                      var srv = document.getElementById('servicios');
                      var h   = document.getElementById('historia-mobile');
                      if (srv && h) {
                        var srvTop = srv.getBoundingClientRect().top;
                        if (srvTop <= 0) {
                          h.style.transition = 'none';
                          h.style.opacity    = '0';
                          h.style.visibility = 'hidden';
                        } else if (window.scrollY >= VH) {
                          h.style.transition = 'none';
                          h.style.opacity    = '1';
                          h.style.visibility = 'visible';
                        }
                      }
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
        {/* Spacer measurement runs here — after <main> is parsed so historia-inner is in DOM */}
        <script dangerouslySetInnerHTML={{ __html: `
          if (window.innerWidth < 768) {
            (function() {
              function setH() {
                var s = document.getElementById('mobile-scroll-spacer');
                var h = document.getElementById('historia-inner');
                if (s && h && h.scrollHeight > 0) s.style.height = (window.innerHeight + h.scrollHeight) + 'px';
              }
              setH();
              window.addEventListener('load', setH);
            })();
          }
        `}} />
        {/* <Footer /> */}
      </body>
    </html>
  );
}
