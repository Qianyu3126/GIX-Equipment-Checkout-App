"use client";

import { useEffect, useState } from "react";
import { supabase, type Item } from "@/lib/supabaseClient";
import { assertArray } from "@/lib/assert";

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from("items")
          .select("*")
          .order("name");
        if (error) throw new Error(error.message);
        const rows = assertArray<Item>(data, "items.select");
        setItems(rows);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Loading items&hellip;</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Available Equipment</h1>

      {/* Desktop: table */}
      <table className="hidden w-full border-collapse text-sm sm:table">
        <thead>
          <tr className="border-b border-slate-200 text-left">
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">Category</th>
            <th className="py-2 pr-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id} className="border-b border-slate-100">
              <td className="py-2 pr-4">{it.name}</td>
              <td className="py-2 pr-4">{it.category ?? "-"}</td>
              <td className="py-2 pr-4">
                <StatusBadge status={it.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: cards */}
      <ul className="space-y-2 sm:hidden">
        {items.map((it) => (
          <li
            key={it.id}
            className="rounded-lg border border-slate-200 p-3"
          >
            <div className="font-semibold">{it.name}</div>
            <div className="mt-1 text-sm text-slate-600">
              {it.category ?? "Uncategorized"}
            </div>
            <div className="mt-2">
              <StatusBadge status={it.status} />
            </div>
          </li>
        ))}
      </ul>

      {items.length === 0 && (
        <p className="text-slate-500">No items registered yet.</p>
      )}
    </section>
  );
}

function StatusBadge({ status }: { status: Item["status"] }) {
  const cls =
    status === "available"
      ? "bg-green-100 text-green-800"
      : "bg-amber-100 text-amber-800";
  return (
    <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${cls}`}>
      {status === "available" ? "Available" : "Checked out"}
    </span>
  );
}
