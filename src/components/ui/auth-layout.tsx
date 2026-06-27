import Link from "next/link";
import { GlassCard } from "./glass-card";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center py-8">
      <div className="mb-6">
        <Link href="/" className="text-sm text-slate-500 transition-colors hover:text-sky-400">
          ← Back to home
        </Link>
      </div>
      <GlassCard>
        <div className="mb-6">
          <p className="section-label mb-2">Account</p>
          <h1 className="text-xl font-semibold tracking-tight text-slate-50">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {children}
        {footer && (
          <p className="mt-6 border-t border-slate-800/80 pt-6 text-center text-sm text-slate-500">
            {footer}
          </p>
        )}
      </GlassCard>
    </div>
  );
}
