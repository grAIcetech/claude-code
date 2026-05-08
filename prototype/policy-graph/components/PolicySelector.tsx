"use client";

import type { PolicyGraph } from "@/lib/types";

interface PolicySelectorProps {
  policies: PolicyGraph[];
  selectedPolicyId: string;
  onSelect: (policyId: string) => void;
}

export function PolicySelector({
  policies,
  selectedPolicyId,
  onSelect
}: PolicySelectorProps) {
  return (
    <nav className="h-full flex flex-col">
      <div className="px-4 pt-4 pb-2">
        <div className="text-[10px] uppercase tracking-wider text-slate-500">
          Policies
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5">
          Placeholder set — not exhaustive
        </div>
      </div>
      <ul className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
        {policies.map((p) => {
          const childCount = p.nodes.filter((n) => n.parentId === p.policyId)
            .length;
          const active = p.policyId === selectedPolicyId;
          return (
            <li key={p.policyId}>
              <button
                onClick={() => onSelect(p.policyId)}
                className={[
                  "w-full text-left px-3 py-2 rounded-md transition-colors border",
                  active
                    ? "bg-policy text-white border-policy"
                    : "bg-white text-slate-800 border-rule hover:border-slate-400"
                ].join(" ")}
              >
                <div className="text-[13px] font-medium leading-tight">
                  {p.policyTitle}
                </div>
                <div
                  className={[
                    "text-[11px] mt-0.5",
                    active ? "text-white/70" : "text-slate-500"
                  ].join(" ")}
                >
                  {childCount} requirement
                  {childCount === 1 ? "" : "s"} (placeholder)
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
