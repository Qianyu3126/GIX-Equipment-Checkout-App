"use client";

import { useEffect, useMemo, useState } from "react";
import {
  supabase,
  type EventRow,
  type EventCategory,
} from "@/lib/supabaseClient";
import { assertArray, assertHasField } from "@/lib/assert";

const CATEGORIES: ("all" | EventCategory)[] = [
  "all",
  "lecture",
  "workshop",
  "career",
  "social",
];

export default function EventsPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | EventCategory>("all");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("starts_at", { ascending: true });
      if (error) throw new Error(error.message);

      const rows = assertArray<EventRow>(data, "events.select");
      rows.forEach((row, i) => {
        assertHasField(row, "id", `events row ${i}`);
        assertHasField(row, "title", `events row ${i}`);
        assertHasField(row, "starts_at", `events row ${i}`);
      });
      setEvents(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      filter === "all" ? events : events.filter((e) => e.category === filter),
    [events, filter]
  );

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">GIX Events</h1>
        <p className="mt-2 text-slate-600">
          Browse upcoming guest lectures, workshops, panels, and social events.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm font-medium text-slate-700">Category:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as "all" | EventCategory)}
          className="rounded border border-slate-300 px-3 py-2 text-base"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All categories" : c[0].toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading events&hellip;</p>}

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-4">
          <p className="text-red-700">Could not load events: {error}</p>
          <button
            onClick={load}
            className="mt-2 rounded bg-red-700 px-3 py-2 text-sm text-white"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-slate-500">No events match this filter.</p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {filtered.map((ev) => (
            <li
              key={ev.id}
              className="rounded-lg border border-slate-200 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold">{ev.title}</h2>
                <CategoryBadge category={ev.category} />
              </div>
              <div className="mt-1 text-sm text-slate-600">
                {formatDate(ev.starts_at)}
              </div>
              {ev.location && (
                <div className="text-sm text-slate-600">{ev.location}</div>
              )}
              {ev.description && (
                <p className="mt-2 text-sm text-slate-700">{ev.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function CategoryBadge({ category }: { category: EventCategory }) {
  const colors: Record<EventCategory, string> = {
    lecture: "bg-blue-100 text-blue-800",
    workshop: "bg-amber-100 text-amber-800",
    career: "bg-purple-100 text-purple-800",
    social: "bg-green-100 text-green-800",
  };
  return (
    <span
      className={`shrink-0 rounded px-2 py-1 text-xs font-medium ${colors[category]}`}
    >
      {category}
    </span>
  );
}
