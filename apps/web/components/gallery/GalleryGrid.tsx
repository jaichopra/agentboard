"use client";

import type { DashboardSpec } from "@/lib/schemas";
import GalleryCard from "./GalleryCard";

interface GalleryGridProps {
  dashboards: DashboardSpec[];
}

export default function GalleryGrid({ dashboards }: GalleryGridProps) {
  if (dashboards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <p className="text-lg">No dashboards yet</p>
        <p className="text-sm">Create one to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {dashboards.map((d) => (
        <GalleryCard key={d.id} dashboard={d} />
      ))}
    </div>
  );
}
