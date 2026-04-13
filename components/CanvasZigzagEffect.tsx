'use client';
import { useEffect, useRef } from 'react';

interface CanvasZigzagProps {
  src: string;
  className?: string;
  baseXRatio?: number; // 0 to 1, where the zigzag starts (e.g., 0.55)
  amplitude?: number; // pixels of the zigzag depth
  frequency?: number; // frequency of the zigzag (vertical spacing)
  speed?: number; // animation speed multiplier
  interactive?: boolean; // whether mouse moves affect it
}

export default function CanvasZigzagEffect({
  src,
  className = '',
  baseXRatio = 0.55,
  amplitude = 30,
  frequency = 0.05,
  speed = 1.5,
  interactive = true,
}: CanvasZigzagProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, hover: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    // We use a blank context locally, but we need standard WebGL for top tier performance
    // if the slice method gets too slow, but HTML5 Canvas 2D `drawImage` slice is actually 
    // highly optimized in V8/WebKit.
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // To prevent image smoothing on the stretched pixel slice which makes it look blurry
    ctx.imageSmoothingEnabled = false;

    const img = new Image();
    img.src = src;

    let animationFrameId: number;

    const render = (time: number) => {
      // Loop
      animationFrameId = requestAnimationFrame(render);
      
      if (!img.complete || img.naturalWidth === 0) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      // Resize canvas if needed
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
      }

      const cw = rect.width;
      const ch = rect.height;

      // Handle interactive mouse easing
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.1;

      // Interactive amplitude boost
      const currentAmplitude = amplitude + (m.hover ? m.x * 20 : 0);
      
      // Calculate image cover/contain metrics.
      // We want the image to fill the height, and at least reach 80% of width.
      const scaleX = (cw * 0.8) / img.naturalWidth;
      const scaleY = ch / img.naturalHeight;
      const scale = Math.max(scaleX, scaleY); // Ensure it fills whichever is logically needed

      const drawWidth = img.naturalWidth * scale;
      const drawHeight = img.naturalHeight * scale;
      const drawY = (ch - drawHeight) / 2;
      const drawX = 0; // align left

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Disable smoothing for the sharp pixel stretch effect
      ctx.imageSmoothingEnabled = false;

      // Draw horizontal slices
      for (let y = 0; y < ch; y++) {
         // Transform canvas Y to image Y
         const imgY = ((y - drawY) / drawHeight) * img.naturalHeight;
         
         // Only draw if within original image vertical bounds
         if (imgY >= 0 && imgY < img.naturalHeight) {
            
            // Calculate zigzag X point for this line
            // We use a triangle/sawtooth wave
            const t = (y * frequency) - (time * 0.001 * speed * 10);
            
            // Triangle wave logic: Math.abs( (x % period) / period - 0.5 ) * 2
            // Let's create a harsh zigzag
            const period = Math.PI * 2;
            const normalizedT = ((t % period) + period) % period; 
            const sawtooth = (Math.abs(normalizedT / period - 0.5) * 2 - 0.5) * 2; // Range -1 to 1

            // Introduce some high-frequency noise for a more "glitched/cut" feel on the edge
            const noise = Math.sin(y * 0.5) * 2;
            
            // Calculate the X coordinate on the canvas where the cut happens
            const edgeX = (cw * baseXRatio) + (sawtooth * currentAmplitude) + noise;

            // Map canvas edgeX back to image coordinates
            const imgEdgeX = Math.min((edgeX / drawWidth) * img.naturalWidth, img.naturalWidth - 2);

            // Left side image (up to the zigzag point)
            if (imgEdgeX > 0) {
                ctx.drawImage(
                    img,
                    0, Math.floor(imgY), Math.floor(imgEdgeX), 1,
                    0, y * dpr, edgeX * dpr, 1 * dpr
                );
                
                // The stretched side (from edgeX to the right edge of the canvas)
                // We sample exactly 1 pixel width at the edge, and stretch it horizontally
                const stretchWidth = cw - edgeX;
                if (stretchWidth > 0 && imgEdgeX < img.naturalWidth - 1) {
                  ctx.drawImage(
                      img,
                      Math.floor(imgEdgeX), Math.floor(imgY), 1, 1,
                      edgeX * dpr, y * dpr, stretchWidth * dpr, 1 * dpr + 0.5 // +0.5 to prevent sub-pixel gaps
                  );
                }
            }
         }
      }
    };

    animationFrameId = requestAnimationFrame(render);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0 to 1
      mouseRef.current.targetX = x;
    };

    const handleMouseEnter = () => { mouseRef.current.hover = true; };
    const handleMouseLeave = () => { mouseRef.current.hover = false; mouseRef.current.targetX = 0; };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [src, baseXRatio, amplitude, frequency, interactive, speed]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden w-full h-full ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />
    </div>
  );
}
