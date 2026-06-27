import { cn } from "@/lib/utils";

export function LoadingSpinner({ className, label }: { className?: string; label?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-20", className)}>
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-300" />
      {label && <p className="text-sm text-zinc-500">{label}</p>}
    </div>
  );
}
