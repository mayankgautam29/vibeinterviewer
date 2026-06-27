import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  badge,
  centered = false,
  className,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  centered?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 space-y-3", centered && "text-center", className)}>
      {badge && <p className="section-label">{badge}</p>}
      <h1 className="page-title">{title}</h1>
      {subtitle && (
        <p className={cn("page-subtitle max-w-2xl", centered && "mx-auto")}>{subtitle}</p>
      )}
    </div>
  );
}
