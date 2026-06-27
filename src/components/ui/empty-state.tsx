import { LucideIcon } from "lucide-react";
import { GradientButton } from "./gradient-button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="surface flex flex-col items-center rounded-xl px-6 py-16 text-center">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800/80 text-slate-400 ring-1 ring-slate-700/50">
        <Icon className="h-5 w-5" strokeWidth={1.25} />
      </div>
      <h3 className="text-base font-medium text-slate-100">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">{description}</p>
      {actionLabel && actionHref && (
        <GradientButton href={actionHref} variant="secondary" className="mt-6">
          {actionLabel}
        </GradientButton>
      )}
    </div>
  );
}
