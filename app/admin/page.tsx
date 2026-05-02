"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPage() {
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<{ kind: "ok" | "err"; msg: string } | null>(
    null
  );
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const { error } = await supabase.from("items").insert({
        name,
        barcode,
        category: category || null,
        status: "available",
      });
      if (error) throw new Error(error.message);
      setStatus({ kind: "ok", msg: `Registered "${name}".` });
      setName("");
      setBarcode("");
      setCategory("");
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
      <h1 className="text-2xl font-bold">Register New Item</h1>
      <p className="text-slate-600">
        Replaces the manual CSV upload step. Enter a clean, human-readable name
        instead of an Amazon product description.
      </p>
      <form onSubmit={onSubmit} className="space-y-3">
        <Field label="Item name" value={name} onChange={setName} required autoFocus />
        <Field label="Barcode" value={barcode} onChange={setBarcode} required />
        <Field label="Category (optional)" value={category} onChange={setCategory} />
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-slate-900 px-4 py-3 text-white disabled:opacity-50 sm:w-auto"
        >
          {busy ? "Saving…" : "Register item"}
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

function Field({
  label,
  value,
  onChange,
  required,
  autoFocus,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  autoFocus?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      <input
        className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-base"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoFocus={autoFocus}
      />
    </label>
  );
}
