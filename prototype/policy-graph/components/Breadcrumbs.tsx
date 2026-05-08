"use client";

import type { PolicyGraph, PolicyGraphNode } from "@/lib/types";

interface BreadcrumbsProps {
  policy: PolicyGraph;
  selectedNode: PolicyGraphNode | null;
  onNavigate: (nodeId: string | null) => void;
}

function trail(
  policy: PolicyGraph,
  node: PolicyGraphNode | null
): PolicyGraphNode[] {
  if (!node) return [];
  const byId = new Map(policy.nodes.map((n) => [n.id, n]));
  const result: PolicyGraphNode[] = [];
  let current: PolicyGraphNode | undefined = node;
  while (current) {
    result.unshift(current);
    current = current.parentId ? byId.get(current.parentId) : undefined;
  }
  return result;
}

export function Breadcrumbs({
  policy,
  selectedNode,
  onNavigate
}: BreadcrumbsProps) {
  const path = trail(policy, selectedNode);

  return (
    <nav
      aria-label="Breadcrumb"
      className="px-6 py-2 bg-canvas border-b border-rule text-[12px]"
    >
      <ol className="flex items-center flex-wrap gap-x-1 gap-y-0.5 text-slate-500">
        <li>
          <button
            onClick={() => onNavigate(null)}
            className="hover:text-policy hover:underline"
          >
            All policies
          </button>
        </li>
        <li className="text-slate-300">/</li>
        <li>
          <button
            onClick={() => onNavigate(policy.policyId)}
            className={[
              "hover:text-policy hover:underline",
              path.length <= 1 ? "text-slate-900 font-medium" : ""
            ].join(" ")}
          >
            {policy.policyTitle}
          </button>
        </li>
        {path.slice(1).map((n, idx, arr) => {
          const isLast = idx === arr.length - 1;
          return (
            <span key={n.id} className="flex items-center gap-x-1">
              <span className="text-slate-300">/</span>
              <button
                onClick={() => onNavigate(n.id)}
                className={[
                  "hover:text-policy hover:underline truncate max-w-[260px]",
                  isLast ? "text-slate-900 font-medium" : ""
                ].join(" ")}
                title={n.title}
              >
                <span className="text-[10px] uppercase tracking-wider text-slate-400 mr-1">
                  {n.type}:
                </span>
                {n.title}
              </button>
            </span>
          );
        })}
      </ol>
    </nav>
  );
}
