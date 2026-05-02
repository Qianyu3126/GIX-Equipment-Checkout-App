import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">GIX Equipment Checkout</h1>
        <p className="mt-2 text-slate-600">
          A unified replacement for the dual-system checkout flow Maason uses today.
          Browse what is available, log a checkout in one step, and scan a barcode to return.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/items"
          className="block rounded-lg border border-slate-200 p-4 hover:border-slate-400"
        >
          <div className="text-base font-semibold">Browse Available Items</div>
          <div className="text-sm text-slate-600">
            For students, before they walk to the desk.
          </div>
        </Link>
        <Link
          href="/checkout"
          className="block rounded-lg border border-slate-200 p-4 hover:border-slate-400"
        >
          <div className="text-base font-semibold">Log a Checkout</div>
          <div className="text-sm text-slate-600">For staff at the desk.</div>
        </Link>
        <Link
          href="/return"
          className="block rounded-lg border border-slate-200 p-4 hover:border-slate-400"
        >
          <div className="text-base font-semibold">Scan a Return</div>
          <div className="text-sm text-slate-600">Single-scan return flow.</div>
        </Link>
        <Link
          href="/admin"
          className="block rounded-lg border border-slate-200 p-4 hover:border-slate-400"
        >
          <div className="text-base font-semibold">Register New Item</div>
          <div className="text-sm text-slate-600">Replaces the manual CSV upload.</div>
        </Link>
      </div>
    </section>
  );
}
