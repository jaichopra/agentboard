import Header from "@/components/layout/Header";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { DEMO_DASHBOARDS } from "@/lib/demo-data";

export default function GalleryPage() {
  // In production, fetch from Modal API
  const dashboards = DEMO_DASHBOARDS.filter((d) => d.published);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-bold text-zinc-100">
          Dashboard Gallery
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Discover dashboards created by the community
        </p>
        <div className="mt-8">
          <GalleryGrid dashboards={dashboards} />
        </div>
      </div>
    </div>
  );
}
