import { LoadingSpinnerProps } from "@/types";

export default function LoadingSpinner({ message = "Chargement...", className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`min-h-screen bg-gray-900 flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
        <div className="text-white text-sm">{message}</div>
      </div>
    </div>
  );
} 