import { Sparkles } from "lucide-react";
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
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <span className="font-semibold text-white">VibeInterviewer</span>
          </Link>
        </div>
        <GlassCard className="glow-ring">
          <h2 className="text-2xl font-bold text-white text-center">{title}</h2>
          {subtitle && <p className="mt-2 text-center text-sm text-slate-400">{subtitle}</p>}
          <div className="mt-6">{children}</div>
          {footer && <div className="mt-6 border-t border-white/10 pt-6 text-center text-sm text-slate-400">{footer}</div>}
        </GlassCard>
      </div>
    </div>
  );
}
