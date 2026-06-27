import Link from "next/link";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-zinc-100 text-zinc-950 hover:bg-white border border-transparent",
  secondary:
    "bg-transparent text-zinc-200 border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900",
  success:
    "bg-emerald-600 text-white border border-emerald-600 hover:bg-emerald-500",
  danger:
    "bg-transparent text-red-400 border border-red-900/60 hover:border-red-700 hover:bg-red-950/40",
  violet:
    "bg-zinc-100 text-zinc-950 hover:bg-white border border-transparent",
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
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
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
