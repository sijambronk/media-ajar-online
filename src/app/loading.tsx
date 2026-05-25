"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-500">
      <div className="relative flex flex-col items-center">
        {/* Spinner Outer */}
        <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        
        {/* Pulsing Logo or Icon in middle (optional, here just using the spinner) */}
        
        <div className="mt-6 flex flex-col items-center space-y-2">
          <h3 className="text-lg font-bold tracking-tight text-foreground animate-pulse">
            Memuat Data...
          </h3>
          <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] animate-pulse delay-75">
            Mohon Tunggu Sebentar
          </p>
        </div>

        {/* Progress bar line at top (simulated) */}
        <div className="fixed top-0 left-0 right-0 h-1 bg-muted overflow-hidden">
          <div className="h-full bg-primary animate-[loading_2s_ease-in-out_infinite] w-full origin-left"></div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes loading {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
