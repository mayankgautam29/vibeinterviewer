import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  badge,
  centered = true,
  className,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  centered?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-10 space-y-3",
        centered && "text-center",
        className
      )}
    >
      {badge && (
        <span className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-cyan-300">
          {badge}
        </span>
      )}
      <h1 className="gradient-text text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h1>
      {subtitle && (
        <p className={cn("text-slate-400 text-base sm:text-lg max-w-2xl", centered && "mx-auto")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
