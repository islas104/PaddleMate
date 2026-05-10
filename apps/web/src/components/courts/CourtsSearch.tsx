"use client";

import { useState, useMemo } from "react";
import { CourtCard } from "./CourtCard";

const TYPE_FILTERS = ["All", "Indoor", "Outdoor"];
const SURFACE_FILTERS = ["All surfaces", "Grass", "Clay", "Hard", "Crystal"];

export function CourtsSearch({ courts }: { courts: any[] }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [surfaceFilter, setSurfaceFilter] = useState("All surfaces");

  const filtered = useMemo(() => {
    let list = courts;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.club?.name?.toLowerCase().includes(q) ||
          c.club?.city?.toLowerCase().includes(q)
      );
    }
    if (typeFilter !== "All") {
      list = list.filter((c) => c.type?.toLowerCase() === typeFilter.toLowerCase());
    }
    if (surfaceFilter !== "All surfaces") {
      list = list.filter((c) =>
        c.surface?.toLowerCase().replace(/_/g, " ").includes(surfaceFilter.toLowerCase())
      );
    }
    return list;
  }, [courts, search, typeFilter, surfaceFilter]);

  const chip = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-semibold border transition-colors cursor-pointer ${
      active
        ? "bg-brand-500 border-brand-500 text-white"
        : "bg-white/5 border-white/10 text-gray-400 hover:border-brand-500/50 hover:text-white"
    }`;

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-5">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courts, clubs or city…"
          className="w-full bg-gray-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TYPE_FILTERS.map((f) => (
          <button key={f} className={chip(typeFilter === f)} onClick={() => setTypeFilter(f)}>{f}</button>
        ))}
        <span className="w-px bg-white/10 mx-1" />
        {SURFACE_FILTERS.map((f) => (
          <button key={f} className={chip(surfaceFilter === f)} onClick={() => setSurfaceFilter(f)}>{f}</button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-5">
        {filtered.length} court{filtered.length !== 1 ? "s" : ""} available
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((court) => (
            <CourtCard key={court.id} court={court} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-600">
          <p className="text-4xl mb-4">🎾</p>
          <p className="font-semibold text-gray-400 mb-1">No courts found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
          {(search || typeFilter !== "All" || surfaceFilter !== "All surfaces") && (
            <button
              onClick={() => { setSearch(""); setTypeFilter("All"); setSurfaceFilter("All surfaces"); }}
              className="mt-4 text-brand-400 hover:text-brand-300 text-sm font-semibold underline underline-offset-2"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
