import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
  narrow,
}: {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <div className={cn(narrow && "mx-auto max-w-lg", className)}>{children}</div>
  );
}
