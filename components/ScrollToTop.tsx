"use client";

import { useEffect } from "react";

export default function ScrollToTop() {
  useEffect(() => {
    // Fallback: if Historia hasn't shown the page after 1s, show it anyway
    const t = setTimeout(() => {
      document.documentElement.style.visibility = '';
    }, 1000);
    return () => clearTimeout(t);
  }, []);
  return null;
}
