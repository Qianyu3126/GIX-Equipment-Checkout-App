"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ReturnPage() {
  const [barcode, setBarcode] = useState("");
  const [status, setStatus] = useState<{ kind: "ok" | "err"; msg: string } | null>(
    null
  );
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const { data: items, error: lookupErr } = await supabase
        .from("items")
        .select("id, name, status")
        .eq("barcode", barcode)
        .limit(1);
      if (lookupErr) throw new Error(`Item lookup: ${lookupErr.message}`);
      if (!items || items.length === 0)
        throw new Error("No item with that barcode.");
      const item = items[0];
      if (item.status === "available") {
        throw new Error(`${item.name} is already marked available.`);
      }

      const { error: updateCheckoutErr } = await supabase
        .from("checkouts")
        .update({ returned_at: new Date().toISOString() })
        .eq("item_id", item.id)
        .is("returned_at", null);
      if (updateCheckoutErr)
        throw new Error(`Mark returned: ${updateCheckoutErr.message}`);

      const { error: updateItemErr } = await supabase
        .from("items")
        .update({ status: "available" })
        .eq("id", item.id);
      if (updateItemErr)
        throw new Error(`Update item: ${updateItemErr.message}`);

      setStatus({ kind: "ok", msg: `${item.name} returned.` });
      setBarcode("");
    } catch (e) {
      setStatus({
        kind: "err",
        msg: e instanceof Error ? e.message : "Unknown error",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Scan a Return</h1>
      <p className="text-slate-600">
        One scan moves the item back to &ldquo;available&rdquo; and timestamps the matching checkout.
      </p>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block">
          <span className="block text-sm font-medium text-slate-700">Item barcode</span>
          <input
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-base"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            required
            autoFocus
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-slate-900 px-4 py-3 text-white disabled:opacity-50 sm:w-auto"
        >
          {busy ? "Saving…" : "Mark returned"}
        </button>
      </form>
      {status && (
        <p className={status.kind === "ok" ? "text-green-700" : "text-red-700"}>
          {status.msg}
        </p>
      )}
    </section>
  );
}
