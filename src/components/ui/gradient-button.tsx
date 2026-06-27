import Link from "next/link";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const variants = {
  primary: "from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-cyan-500/25",
  success: "from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-emerald-500/25",
  danger: "from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 shadow-rose-500/25",
  violet: "from-violet-500 to-fuchsia-600 hover:from-violet-400 hover:to-fuchsia-500 shadow-violet-500/25",
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
}: Props) {
  const classes = cn(
    "relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    fullWidth && "w-full",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={classes}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
