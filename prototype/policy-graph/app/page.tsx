"use client";

import { useMemo, useState } from "react";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DetailRail } from "@/components/DetailRail";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { FilterBar } from "@/components/FilterBar";
import { GraphCanvas } from "@/components/GraphCanvas";
import { PolicySelector } from "@/components/PolicySelector";
import { PolicyTimeline } from "@/components/PolicyTimeline";
import { POLICY_GRAPHS, getPolicyById } from "@/lib/seedData";
import {
  ALL_CONFIDENCE_LEVELS,
  ALL_NODE_TYPES,
  Filters,
  PolicyGraphNode
} from "@/lib/types";

const initialFilters: Filters = {
  types: [...ALL_NODE_TYPES],
  linesOfBusiness: [],
  responsibleActors: [],
  confidenceLevels: [...ALL_CONFIDENCE_LEVELS]
};

export default function Page() {
  const [selectedPolicyId, setSelectedPolicyId] = useState(
    POLICY_GRAPHS[0].policyId
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const policy = getPolicyById(selectedPolicyId) ?? POLICY_GRAPHS[0];

  const visibleNodeIds = useMemo(() => {
    const matches = (n: PolicyGraphNode) => {
      if (n.type === "Policy") return true; // always show root
      if (!filters.types.includes(n.type)) return false;
      if (
        filters.linesOfBusiness.length > 0 &&
        !n.affectedLinesOfBusiness.some((l) =>
          filters.linesOfBusiness.includes(l)
        )
      ) {
        return false;
      }
      if (
        filters.responsibleActors.length > 0 &&
        !n.responsibleActors.some((a) =>
          filters.responsibleActors.includes(a)
        )
      ) {
        return false;
      }
      if (!filters.confidenceLevels.includes(n.confidenceLevel)) return false;
      return true;
    };
    return new Set(policy.nodes.filter(matches).map((n) => n.id));
  }, [policy, filters]);

  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return policy.nodes.find((n) => n.id === selectedNodeId) ?? null;
  }, [policy, selectedNodeId]);

  const handleSelectPolicy = (id: string) => {
    setSelectedPolicyId(id);
    setSelectedNodeId(null);
  };

  const handleSelectNode = (node: PolicyGraphNode) => {
    setSelectedNodeId(node.id);
  };

  const handleBreadcrumbNavigate = (id: string | null) => {
    if (id === null) {
      setSelectedNodeId(null);
      return;
    }
    if (id === policy.policyId) {
      setSelectedNodeId(null);
      return;
    }
    setSelectedNodeId(id);
  };

  return (
    <div className="h-screen flex flex-col bg-canvas">
      <header className="px-6 py-3 bg-white border-b border-rule flex items-center justify-between">
        <div>
          <div className="serif text-lg text-slate-900 leading-tight">
            Nested Policy Timeline · Deep-Click Knowledge Graph
          </div>
          <div className="text-[11px] text-slate-500">
            Prototype · placeholder content only · not a complete representation
          </div>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <Legend />
        </div>
      </header>

      <DisclaimerBanner />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[260px] shrink-0 bg-white border-r border-rule">
          <PolicySelector
            policies={POLICY_GRAPHS}
            selectedPolicyId={selectedPolicyId}
            onSelect={handleSelectPolicy}
          />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <PolicyTimeline
            policy={policy}
            selectedNodeId={selectedNodeId}
            onSelectNode={handleSelectNode}
          />
          <Breadcrumbs
            policy={policy}
            selectedNode={selectedNode}
            onNavigate={handleBreadcrumbNavigate}
          />
          <FilterBar
            policy={policy}
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(initialFilters)}
          />
          <div className="flex-1 min-h-0 bg-canvas">
            <GraphCanvas
              policy={policy}
              visibleNodeIds={visibleNodeIds}
              selectedNodeId={selectedNodeId}
              onSelectNode={handleSelectNode}
            />
          </div>
        </div>

        <div className="w-[360px] shrink-0">
          <DetailRail node={selectedNode} />
        </div>
      </div>
    </div>
  );
}

function Legend() {
  const items: Array<{ label: string; cls: string }> = [
    { label: "Policy", cls: "bg-policy" },
    { label: "Requirement", cls: "bg-requirement" },
    { label: "Milestone", cls: "bg-milestone" },
    { label: "Action", cls: "bg-action" },
    { label: "Source", cls: "bg-source" },
    { label: "Open Q", cls: "border-2 border-question bg-white" }
  ];
  return (
    <div className="flex items-center gap-3">
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-1.5">
          <span className={`inline-block w-2.5 h-2.5 rounded-sm ${i.cls}`} />
          {i.label}
        </span>
      ))}
    </div>
  );
}
