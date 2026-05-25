import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
      <div className="relative">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
        <div className="absolute -bottom-2 -right-2 h-6 w-6 bg-secondary rounded-full border-2 border-background flex items-center justify-center shadow-sm">
          <div className="h-2 w-2 bg-primary rounded-full animate-ping" />
        </div>
      </div>
      <div className="text-center space-y-1">
        <h3 className="font-bold text-lg text-foreground tracking-tight">Memuat Data...</h3>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Harap tunggu sebentar</p>
      </div>
    </div>
  );
}
