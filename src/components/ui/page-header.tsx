import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  badge,
  centered = false,
  className,
  hero = false,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  centered?: boolean;
  className?: string;
  hero?: boolean;
}) {
  return (
    <div className={cn("mb-10 space-y-3", centered && "text-center", className)}>
      {badge && (
        <>
          <p className="section-label">{badge}</p>
          <div className={cn("accent-line", centered && "mx-auto")} />
        </>
      )}
      <h1 className={hero ? "hero-title" : "page-title"}>{title}</h1>
      {subtitle && (
        <p className={cn("page-subtitle max-w-2xl", centered && "mx-auto")}>{subtitle}</p>
      )}
    </div>
  );
}
