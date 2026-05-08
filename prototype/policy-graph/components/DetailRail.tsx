"use client";

import { NODE_STYLES } from "@/lib/nodeStyles";
import {
  ConfidenceLevel,
  PLACEHOLDER_CITATION,
  PLACEHOLDER_DATE,
  PolicyGraphNode
} from "@/lib/types";

interface DetailRailProps {
  node: PolicyGraphNode | null;
}

function ConfidencePill({ level }: { level: ConfidenceLevel }) {
  const palette: Record<ConfidenceLevel, { bg: string; fg: string }> = {
    High: { bg: "#ECFDF5", fg: "#065F46" },
    Medium: { bg: "#FFFBEB", fg: "#92400E" },
    Low: { bg: "#FEF2F2", fg: "#B42318" },
    "To be confirmed": { bg: "#F1F5F9", fg: "#475569" }
  };
  const c = palette[level];
  return (
    <span
      className="inline-block text-[11px] px-2 py-0.5 rounded-full"
      style={{ backgroundColor: c.bg, color: c.fg }}
    >
      {level}
    </span>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-rule py-3">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
        {label}
      </div>
      <div className="text-[13px] text-slate-800 leading-snug">{children}</div>
    </div>
  );
}

function PlaceholderText({ value }: { value: string }) {
  const isPlaceholder =
    value.startsWith("[") || value === PLACEHOLDER_DATE ||
    value === PLACEHOLDER_CITATION;
  return (
    <span className={isPlaceholder ? "text-slate-500 italic" : ""}>
      {value}
    </span>
  );
}

export function DetailRail({ node }: DetailRailProps) {
  if (!node) {
    return (
      <aside className="h-full bg-white border-l border-rule p-6 flex flex-col">
        <div className="serif text-lg text-slate-900 mb-2">Detail</div>
        <p className="text-[13px] text-slate-500">
          Select a node in the graph or a milestone on the timeline to see its
          placeholder details.
        </p>
        <div className="mt-6 p-3 bg-canvas border border-rule rounded text-[12px] text-slate-600">
          <strong className="text-slate-800">Note.</strong> All values are
          placeholders. The graph is not a complete representation of any
          policy.
        </div>
      </aside>
    );
  }

  const style = NODE_STYLES[node.type];

  return (
    <aside className="h-full bg-white border-l border-rule overflow-y-auto">
      <div className="px-6 pt-6 pb-3 border-b border-rule">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="inline-block w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: style.bg, borderColor: style.border }}
          />
          <span className="text-[10px] uppercase tracking-wider text-slate-500">
            {style.label}
          </span>
        </div>
        <h2 className="serif text-xl leading-snug text-slate-900">
          {node.title}
        </h2>
        <p className="mt-2 text-[13px] text-slate-600 leading-relaxed">
          {node.summary}
        </p>
      </div>

      <div className="px-6">
        {node.date !== undefined && (
          <Field label="Date">
            <PlaceholderText value={node.date} />
          </Field>
        )}

        <Field label="Affected lines of business">
          {node.affectedLinesOfBusiness.length === 0 ? (
            <span className="text-slate-500 italic">None recorded</span>
          ) : (
            <ul className="space-y-1">
              {node.affectedLinesOfBusiness.map((l) => (
                <li key={l}>
                  <PlaceholderText value={l} />
                </li>
              ))}
            </ul>
          )}
        </Field>

        <Field label="Responsible actors">
          {node.responsibleActors.length === 0 ? (
            <span className="text-slate-500 italic">None assigned</span>
          ) : (
            <ul className="space-y-1">
              {node.responsibleActors.map((a) => (
                <li key={a}>
                  <PlaceholderText value={a} />
                </li>
              ))}
            </ul>
          )}
        </Field>

        <Field label="Source citation">
          <PlaceholderText value={node.sourceCitation} />
        </Field>

        <Field label="Confidence level">
          <ConfidencePill level={node.confidenceLevel} />
        </Field>

        <Field label="Data needed flags">
          {node.dataNeededFlags.length === 0 ? (
            <span className="text-slate-500 italic">No flags</span>
          ) : (
            <ul className="space-y-1">
              {node.dataNeededFlags.map((f) => (
                <li
                  key={f}
                  className="text-[12px] text-question flex items-start gap-1.5"
                >
                  <span aria-hidden className="mt-1 inline-block w-1 h-1 rounded-full bg-question" />
                  {f}
                </li>
              ))}
            </ul>
          )}
        </Field>

        <div className="py-4 text-[11px] text-slate-500">
          Node id: <code className="font-mono">{node.id}</code>
          {node.parentId && (
            <>
              {" · "}parent: <code className="font-mono">{node.parentId}</code>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
