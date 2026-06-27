import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-xl backdrop-blur-xl",
        hover && "transition-all duration-300 hover:border-cyan-500/30 hover:shadow-cyan-500/10 hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </div>
  );
}
