"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AuthButton from "@/components/authbutton";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Jobs" },
  { href: "/jobnew", label: "Post a job" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-100 text-xs font-bold text-zinc-950">
            VI
          </span>
          <span className="text-sm font-semibold tracking-tight text-zinc-100">
            VibeInterviewer
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors",
                isActive(link.href)
                  ? "font-medium text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-200"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <AuthButton />
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm",
                  isActive(link.href)
                    ? "bg-zinc-900 font-medium text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-900/60"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-zinc-800 pt-3">
              <AuthButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
