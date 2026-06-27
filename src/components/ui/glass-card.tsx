import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  hover = false,
  padding = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: boolean;
}) {
  return (
    <div
      className={cn(
        "surface rounded-lg",
        padding && "p-6",
        hover && "surface-hover cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
