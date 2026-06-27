import Link from "next/link";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-gradient-to-r from-sky-500 to-teal-500 text-slate-950 shadow-md shadow-sky-500/20 hover:brightness-110 border border-transparent",
  secondary:
    "bg-slate-800/80 text-slate-200 border border-slate-600/60 hover:border-sky-500/40 hover:bg-slate-800",
  success:
    "bg-emerald-600 text-white border border-emerald-500/50 hover:bg-emerald-500 shadow-sm",
  danger:
    "bg-red-950/40 text-red-300 border border-red-800/60 hover:border-red-600/60 hover:bg-red-950/60",
  violet:
    "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-md shadow-violet-500/20 hover:brightness-110 border border-transparent",
};

type Props = {
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof variants;
  loading?: boolean;
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  fullWidth?: boolean;
  size?: "sm" | "md";
};

export function GradientButton({
  children,
  className,
  variant = "primary",
  loading,
  disabled,
  href,
  onClick,
  type = "button",
  fullWidth,
  size = "md",
}: Props) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40",
    size === "sm" ? "px-3 py-1.5" : "px-4 py-2.5",
    variants[variant],
    fullWidth && "w-full",
    className
  );

  if (href) {
    return <Link href={href} className={classes}>{children}</Link>;
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={classes}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
