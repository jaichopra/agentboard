"use client";

import dynamic from "next/dynamic";
import type { Widget } from "@/lib/schemas";
import WidgetShell from "../WidgetShell";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface VideoWidgetProps {
  widget: Widget;
  data: Record<string, unknown>[];
}

export default function VideoWidget({ widget, data }: VideoWidgetProps) {
  const config = widget.config as {
    src?: string;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    controls?: boolean;
    caption?: string;
  };

  const src = config.src || (data[0]?.src as string) || "";

  return (
    <WidgetShell title={widget.title} description={widget.description}>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg bg-black">
        {src ? (
          <ReactPlayer
            src={src}
            width="100%"
            height="100%"
            playing={config.autoplay ?? false}
            loop={config.loop ?? false}
            muted={config.muted ?? true}
            controls={config.controls ?? true}
            style={{ position: "absolute", top: 0, left: 0 }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-600">
            No video source
          </div>
        )}
      </div>
      {config.caption && (
        <p className="mt-2 text-center text-xs text-zinc-500">{config.caption}</p>
      )}
    </WidgetShell>
  );
}
