import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agentboard — AI-Powered Dashboards",
  description:
    "Create intelligent dashboards powered by AI agents. No code required.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-50 antialiased">
        {children}
      </body>
    </html>
  );
}
