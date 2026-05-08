"use client";

import { useMemo } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  MarkerType,
  Node,
  ReactFlowProvider
} from "reactflow";
import "reactflow/dist/style.css";

import { PolicyNode, PolicyNodeData } from "./PolicyNode";
import type { PolicyGraph, PolicyGraphNode } from "@/lib/types";

const nodeTypes = { policyNode: PolicyNode };

interface GraphCanvasProps {
  policy: PolicyGraph;
  visibleNodeIds: Set<string>;
  selectedNodeId: string | null;
  onSelectNode: (node: PolicyGraphNode) => void;
}

const HORIZONTAL_GAP = 280;
const VERTICAL_GAP = 140;

/**
 * Lays out nodes in a simple BFS tree by parentId. Pure placeholder layout —
 * no force simulation. Children are spread horizontally beneath their parent.
 */
function layoutNodes(policy: PolicyGraph): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  const childrenByParent = new Map<string, string[]>();
  for (const n of policy.nodes) {
    if (!n.parentId) continue;
    const arr = childrenByParent.get(n.parentId) ?? [];
    arr.push(n.id);
    childrenByParent.set(n.parentId, arr);
  }

  const root = policy.nodes.find((n) => !n.parentId);
  if (!root) return positions;

  const place = (id: string, depth: number, slot: number, span: number) => {
    const x = (slot - span / 2 + 0.5) * HORIZONTAL_GAP;
    const y = depth * VERTICAL_GAP;
    positions.set(id, { x, y });
    const kids = childrenByParent.get(id) ?? [];
    if (kids.length === 0) return;
    kids.forEach((kidId, i) => {
      // distribute children around current x
      const kidSlot = slot - kids.length / 2 + i + 0.5;
      place(kidId, depth + 1, kidSlot, 1);
    });
  };

  // Root placement
  positions.set(root.id, { x: 0, y: 0 });
  const topReqs = childrenByParent.get(root.id) ?? [];
  const span = topReqs.length;
  topReqs.forEach((reqId, i) => {
    const slot = i - (span - 1) / 2;
    place(reqId, 1, slot, 1);
  });

  return positions;
}

export function GraphCanvas({
  policy,
  visibleNodeIds,
  selectedNodeId,
  onSelectNode
}: GraphCanvasProps) {
  const positions = useMemo(() => layoutNodes(policy), [policy]);

  const nodes: Node<PolicyNodeData>[] = useMemo(() => {
    return policy.nodes
      .filter((n) => visibleNodeIds.has(n.id))
      .map((n) => ({
        id: n.id,
        type: "policyNode",
        position: positions.get(n.id) ?? { x: 0, y: 0 },
        data: { node: n, selected: n.id === selectedNodeId }
      }));
  }, [policy, positions, visibleNodeIds, selectedNodeId]);

  const edges: Edge[] = useMemo(() => {
    return policy.edges
      .filter(
        (e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)
      )
      .map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.relationship,
        labelStyle: { fill: "#64748B", fontSize: 10 },
        labelBgStyle: { fill: "#FAFAFA" },
        labelBgPadding: [4, 2] as [number, number],
        style: { stroke: "#CBD5E1", strokeWidth: 1.25 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#CBD5E1",
          width: 14,
          height: 14
        },
        type: "smoothstep"
      }));
  }, [policy, visibleNodeIds]);

  return (
    <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.4}
        maxZoom={1.5}
        proOptions={{ hideAttribution: false }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        onNodeClick={(_evt, node) => {
          const policyNode = policy.nodes.find((n) => n.id === node.id);
          if (policyNode) onSelectNode(policyNode);
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#E2E8F0"
        />
        <Controls
          showInteractive={false}
          className="!shadow-none !border !border-rule !bg-white"
        />
      </ReactFlow>
    </ReactFlowProvider>
  );
}
