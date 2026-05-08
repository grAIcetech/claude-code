import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Policy Graph Prototype",
  description:
    "Placeholder prototype: nested policy timeline with deep-click knowledge graph. All content is non-authoritative."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-canvas text-slate-900">{children}</body>
    </html>
  );
}
