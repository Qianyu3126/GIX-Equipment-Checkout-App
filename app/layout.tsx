import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "GIX Equipment Checkout",
  description: "Browse, checkout, and return GIX equipment.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3">
            <Link href="/" className="text-lg font-semibold">
              GIX Checkout
            </Link>
            <div className="flex flex-wrap gap-3 text-sm">
              <Link href="/items" className="rounded px-3 py-2 hover:bg-slate-100">
                Browse
              </Link>
              <Link href="/events" className="rounded px-3 py-2 hover:bg-slate-100">
                Events
              </Link>
              <Link href="/checkout" className="rounded px-3 py-2 hover:bg-slate-100">
                Checkout
              </Link>
              <Link href="/return" className="rounded px-3 py-2 hover:bg-slate-100">
                Return
              </Link>
              <Link href="/admin" className="rounded px-3 py-2 hover:bg-slate-100">
                Admin
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
