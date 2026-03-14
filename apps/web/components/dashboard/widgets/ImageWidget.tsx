"use client";

import type { Widget } from "@/lib/schemas";
import WidgetShell from "../WidgetShell";

interface ImageWidgetProps {
  widget: Widget;
  data: Record<string, unknown>[];
}

export default function ImageWidget({ widget, data }: ImageWidgetProps) {
  const config = widget.config as {
    src?: string;
    alt?: string;
    objectFit?: "cover" | "contain" | "fill" | "none";
    caption?: string;
  };

  const src = config.src || (data[0]?.src as string) || "";
  const alt = config.alt || widget.title;
  const objectFit = config.objectFit || "cover";

  return (
    <WidgetShell title={widget.title} description={widget.description}>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className="h-full w-full"
            style={{ objectFit }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-600">
            No image source
          </div>
        )}
      </div>
      {config.caption && (
        <p className="mt-2 text-center text-xs text-zinc-500">{config.caption}</p>
      )}
    </WidgetShell>
  );
}
