"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { assertHasField } from "@/lib/assert";

export default function CheckoutPage() {
  const [barcode, setBarcode] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
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
        .select("id, status")
        .eq("barcode", barcode)
        .limit(1);
      if (lookupErr) throw new Error(`Item lookup: ${lookupErr.message}`);
      if (!items || items.length === 0) throw new Error("No item with that barcode.");
      const item = items[0];
      assertHasField(item, "id", "items lookup");
      if (item.status !== "available") {
        throw new Error("Item is already checked out.");
      }

      const due = new Date();
      due.setDate(due.getDate() + 7);

      const { error: insertErr } = await supabase.from("checkouts").insert({
        item_id: item.id,
        student_name: studentName,
        student_email: studentEmail,
        due_at: due.toISOString(),
      });
      if (insertErr) throw new Error(`Insert checkout: ${insertErr.message}`);

      const { error: updateErr } = await supabase
        .from("items")
        .update({ status: "checked_out" })
        .eq("id", item.id);
      if (updateErr) throw new Error(`Update item status: ${updateErr.message}`);

      setStatus({
        kind: "ok",
        msg: `Checked out to ${studentName}. Due ${due.toLocaleDateString()}.`,
      });
      setBarcode("");
      setStudentName("");
      setStudentEmail("");
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
      <h1 className="text-2xl font-bold">Log a Checkout</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <Field
          label="Item barcode"
          value={barcode}
          onChange={setBarcode}
          autoFocus
          required
        />
        <Field
          label="Student name"
          value={studentName}
          onChange={setStudentName}
          required
        />
        <Field
          label="Student email"
          value={studentEmail}
          onChange={setStudentEmail}
          type="email"
          required
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-slate-900 px-4 py-3 text-white disabled:opacity-50 sm:w-auto"
        >
          {busy ? "Saving…" : "Check out"}
        </button>
      </form>
      {status && (
        <p
          className={
            status.kind === "ok" ? "text-green-700" : "text-red-700"
          }
        >
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
  type = "text",
  required,
  autoFocus,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoFocus?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      <input
        className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-base"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoFocus={autoFocus}
      />
    </label>
  );
}
