"use client";

import { useMemo } from "react";
import { NODE_STYLES } from "@/lib/nodeStyles";
import {
  ALL_CONFIDENCE_LEVELS,
  ALL_NODE_TYPES,
  ConfidenceLevel,
  Filters,
  NodeType,
  PolicyGraph
} from "@/lib/types";

interface FilterBarProps {
  policy: PolicyGraph;
  filters: Filters;
  onChange: (next: Filters) => void;
  onReset: () => void;
}

function toggle<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export function FilterBar({
  policy,
  filters,
  onChange,
  onReset
}: FilterBarProps) {
  const lobs = useMemo(() => {
    const set = new Set<string>();
    policy.nodes.forEach((n) =>
      n.affectedLinesOfBusiness.forEach((l) => set.add(l))
    );
    return Array.from(set);
  }, [policy]);

  const actors = useMemo(() => {
    const set = new Set<string>();
    policy.nodes.forEach((n) => n.responsibleActors.forEach((a) => set.add(a)));
    return Array.from(set);
  }, [policy]);

  const setTypes = (t: NodeType) =>
    onChange({ ...filters, types: toggle(filters.types, t) });
  const setLob = (l: string) =>
    onChange({ ...filters, linesOfBusiness: toggle(filters.linesOfBusiness, l) });
  const setActor = (a: string) =>
    onChange({
      ...filters,
      responsibleActors: toggle(filters.responsibleActors, a)
    });
  const setConfidence = (c: ConfidenceLevel) =>
    onChange({
      ...filters,
      confidenceLevels: toggle(filters.confidenceLevels, c)
    });

  return (
    <div className="px-6 py-3 bg-white border-b border-rule">
      <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
        <FilterGroup label="Type">
          <div className="flex flex-wrap gap-1.5">
            {ALL_NODE_TYPES.map((t) => {
              const active = filters.types.includes(t);
              return (
                <Chip
                  key={t}
                  active={active}
                  onClick={() => setTypes(t)}
                  swatch={
                    <span
                      className={[
                        "inline-block w-2 h-2 rounded-sm mr-1.5 align-middle",
                        NODE_STYLES[t].swatchClass
                      ].join(" ")}
                    />
                  }
                >
                  {t}
                </Chip>
              );
            })}
          </div>
        </FilterGroup>

        <FilterGroup label="Line of business">
          <div className="flex flex-wrap gap-1.5">
            {lobs.map((l) => (
              <Chip
                key={l}
                active={filters.linesOfBusiness.includes(l)}
                onClick={() => setLob(l)}
              >
                {l}
              </Chip>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Responsible actor">
          <div className="flex flex-wrap gap-1.5">
            {actors.map((a) => (
              <Chip
                key={a}
                active={filters.responsibleActors.includes(a)}
                onClick={() => setActor(a)}
              >
                {a}
              </Chip>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Confidence">
          <div className="flex flex-wrap gap-1.5">
            {ALL_CONFIDENCE_LEVELS.map((c) => (
              <Chip
                key={c}
                active={filters.confidenceLevels.includes(c)}
                onClick={() => setConfidence(c)}
              >
                {c}
              </Chip>
            ))}
          </div>
        </FilterGroup>

        <div className="ml-auto self-center">
          <button
            onClick={onReset}
            className="text-[11px] text-slate-500 hover:text-policy underline"
          >
            Reset filters
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-[160px]">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
        {label}
      </div>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  swatch
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  swatch?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "text-[11px] px-2 py-1 rounded-full border transition-colors",
        active
          ? "bg-policy text-white border-policy"
          : "bg-white text-slate-700 border-rule hover:border-slate-400"
      ].join(" ")}
    >
      {swatch}
      <span className="align-middle">{children}</span>
    </button>
  );
}
