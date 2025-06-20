import { LoadingSpinnerProps } from "@/types";

export default function LoadingSpinner({ message = "Chargement...", className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`min-h-screen bg-[var(--background)] flex items-center justify-center ${className}`}>
      {/* Lignes de grille en fond */}
      <div className="absolute inset-0 z-0">
        <div className="h-full w-full border-r border-dashed border-[var(--foreground)]/10" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
        <div className="text-[var(--foreground)] text-sm font-semibold">{message}</div>
      </div>
    </div>
  );
} 