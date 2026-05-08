"use client";

import { NODE_STYLES } from "@/lib/nodeStyles";
import { PLACEHOLDER_DATE, PolicyGraph, PolicyGraphNode } from "@/lib/types";

interface PolicyTimelineProps {
  policy: PolicyGraph;
  selectedNodeId: string | null;
  onSelectNode: (node: PolicyGraphNode) => void;
}

/**
 * Placeholder horizontal timeline. Because every milestone date is
 * "[DATE TO BE SOURCED]", ticks are evenly distributed and clearly labeled
 * as un-sourced. This is intentional — we do not invent dates.
 */
export function PolicyTimeline({
  policy,
  selectedNodeId,
  onSelectNode
}: PolicyTimelineProps) {
  const milestones = policy.nodes.filter((n) => n.type === "Milestone");

  return (
    <div className="px-6 py-3 bg-white border-b border-rule">
      <div className="flex items-baseline justify-between mb-2">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500">
            Policy Timeline
          </div>
          <div className="text-[11px] text-slate-400">
            Dates are placeholders — none have been sourced
          </div>
        </div>
        <div className="text-[11px] text-slate-500">
          {milestones.length} milestone{milestones.length === 1 ? "" : "s"}{" "}
          (placeholder)
        </div>
      </div>
      <div className="relative h-12">
        <div className="absolute left-0 right-0 top-1/2 h-px bg-rule" />
        <div className="relative h-full flex items-center justify-between">
          {milestones.length === 0 ? (
            <div className="w-full text-center text-[11px] text-slate-400">
              No placeholder milestones for this policy.
            </div>
          ) : (
            milestones.map((m) => {
              const active = m.id === selectedNodeId;
              return (
                <button
                  key={m.id}
                  onClick={() => onSelectNode(m)}
                  className="group relative flex flex-col items-center"
                  title={m.title}
                >
                  <span
                    className={[
                      "block w-3 h-3 rounded-full border-2 transition-transform",
                      active ? "scale-125" : "group-hover:scale-110"
                    ].join(" ")}
                    style={{
                      backgroundColor: NODE_STYLES.Milestone.bg,
                      borderColor: active
                        ? NODE_STYLES.Policy.bg
                        : NODE_STYLES.Milestone.bg
                    }}
                  />
                  <span className="mt-1 text-[10px] text-slate-500">
                    {m.date && m.date !== PLACEHOLDER_DATE
                      ? m.date
                      : "—"}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
