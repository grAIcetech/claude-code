"use client";

import { Handle, NodeProps, Position } from "reactflow";
import { NODE_STYLES } from "@/lib/nodeStyles";
import type { PolicyGraphNode } from "@/lib/types";

export interface PolicyNodeData {
  node: PolicyGraphNode;
  selected: boolean;
}

export function PolicyNode({ data }: NodeProps<PolicyNodeData>) {
  const style = NODE_STYLES[data.node.type];
  const isPolicy = data.node.type === "Policy";
  const isQuestion = data.node.type === "Open Question";

  return (
    <div
      className={[
        "rounded-md px-3 py-2 shadow-sm transition-shadow",
        "min-w-[180px] max-w-[240px] text-left",
        data.selected ? "ring-2 ring-offset-2 ring-policy" : "",
        isQuestion ? "border-[1.5px]" : "border"
      ].join(" ")}
      style={{
        backgroundColor: style.bg,
        color: style.fg,
        borderColor: style.border
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div
        className="text-[10px] uppercase tracking-wider mb-1 opacity-80"
        style={{ color: style.fg }}
      >
        {style.label}
      </div>
      <div
        className={[
          "leading-snug",
          isPolicy ? "text-sm font-semibold" : "text-[13px] font-medium"
        ].join(" ")}
        style={{ color: style.fg }}
      >
        {data.node.title}
      </div>
      {data.node.confidenceLevel === "To be confirmed" && (
        <div
          className="mt-1.5 inline-block text-[10px] px-1.5 py-0.5 rounded-sm"
          style={{
            backgroundColor: isQuestion ? "#FEF2F2" : "rgba(255,255,255,0.18)",
            color: isQuestion ? "#B42318" : style.fg
          }}
        >
          confidence: to be confirmed
        </div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
