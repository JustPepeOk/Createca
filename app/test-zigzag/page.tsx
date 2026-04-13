import CanvasZigzagEffect from '@/components/CanvasZigzagEffect';

export default function TestZigzagPage() {
  return (
    <main className="w-full h-screen bg-[#111111] overflow-hidden flex flex-col justify-center items-center relative">
      {/* 
        The background is dark to match the billboard effect background.
      */}
      <div className="absolute inset-0 z-0">
        <CanvasZigzagEffect 
          src="/dios.png"
          baseXRatio={0.52} 
          amplitude={40} 
          frequency={0.06}
          speed={0.2}
          interactive={true}
        />
      </div>

      {/* Foreground typography mimicking the billboard */}
      <div className="relative z-10 text-white flex flex-col items-center justify-center font-sans tracking-wide mix-blend-difference pointer-events-none select-none drop-shadow-lg">
         <div className="flex items-center gap-4 text-2xl md:text-5xl lg:text-7xl font-light">
            <span className="text-xl md:text-3xl opacity-70">20</span>
            <h1 className="font-bold tracking-widest border-x-4 border-white px-4 md:px-8">
              CREATECA
            </h1>
            <span className="text-xl md:text-3xl opacity-70">26</span>
         </div>
         <p className="mt-4 md:mt-8 text-xs md:text-sm tracking-[0.2em] uppercase text-center opacity-80 max-w-[300px] md:max-w-none">
            Developing brand through a new world vision
         </p>
      </div>
    </main>
  );
}
