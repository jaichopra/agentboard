import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-green-500 text-sm font-bold text-zinc-950">
            A
          </div>
          <span className="font-semibold text-zinc-100">Agentboard</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/gallery"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Gallery
          </Link>
          <Link
            href="/docs"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Docs
          </Link>
          <Link
            href="/create"
            className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-500 transition-colors"
          >
            Create Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
