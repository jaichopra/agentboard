"use client";

import type { Widget } from "@/lib/schemas";
import WidgetShell from "../WidgetShell";

interface ImageGridWidgetProps {
  widget: Widget;
  data: Record<string, unknown>[];
}

export default function ImageGridWidget({ widget, data }: ImageGridWidgetProps) {
  const config = widget.config as {
    images?: { src: string; alt?: string; caption?: string }[];
    columns?: number;
    gap?: number;
    objectFit?: "cover" | "contain";
  };

  const images = config.images || data.map((d) => ({
    src: String(d.src || ""),
    alt: String(d.alt || ""),
    caption: d.caption ? String(d.caption) : undefined,
  }));
  const columns = config.columns || 3;
  const gap = config.gap || 8;
  const objectFit = config.objectFit || "cover";

  return (
    <WidgetShell title={widget.title} description={widget.description}>
      <div
        className="min-h-0 flex-1 overflow-auto"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap,
        }}
      >
        {images.map((img, i) => (
          <div key={i} className="group relative overflow-hidden rounded-lg bg-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt || `Image ${i + 1}`}
              className="h-full w-full transition-transform group-hover:scale-105"
              style={{ objectFit }}
            />
            {img.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p className="text-xs text-zinc-300">{img.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </WidgetShell>
  );
}
