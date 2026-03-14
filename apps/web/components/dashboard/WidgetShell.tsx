"use client";

import { cn } from "@/lib/utils";

interface WidgetShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  /** Label style title (uppercase, small — used for KPI cards) */
  labelTitle?: boolean;
  /** Don't show title */
  noTitle?: boolean;
}

export default function WidgetShell({
  title,
  description,
  children,
  className,
  labelTitle,
  noTitle,
}: WidgetShellProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-sm",
        className
      )}
    >
      {!noTitle && (
        <div className={labelTitle ? "mb-auto" : "mb-2"}>
          <p
            className={cn(
              labelTitle
                ? "text-xs font-medium uppercase tracking-wider text-zinc-500"
                : "text-sm font-semibold text-zinc-200"
            )}
          >
            {title}
          </p>
          {description && (
            <p className="mt-0.5 text-xs text-zinc-500">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
