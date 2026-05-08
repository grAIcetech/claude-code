# Nested Policy Timeline — Deep-Click Knowledge Graph

Front-end interaction spec for the prototype in this directory.

## Goal

Surface **traceability**, not decoration. A user should be able to move from a
parent policy to a sub-requirement to an actor-specific action to its source —
in as few clicks as possible, without ever being misled into thinking the graph
is complete or authoritative.

> The stated ask is a clickable timeline. The real ask is traceability.

## Non-goals

- Production database, authentication, export.
- Real citations, dates, deadlines, obligations, legal interpretations.
- Any claim that the graph is complete.
- Automated legal reasoning.

## Data model

See [`lib/types.ts`](./lib/types.ts).

```ts
type NodeType =
  | "Policy"
  | "Requirement"
  | "Milestone"
  | "Checklist Action"
  | "Source"
  | "Open Question";

type ConfidenceLevel = "High" | "Medium" | "Low" | "To be confirmed";

interface PolicyGraphNode {
  id: string;
  parentId?: string;
  type: NodeType;
  title: string;
  summary: string;
  date?: string; // ISO date or "[DATE TO BE SOURCED]"
  affectedLinesOfBusiness: string[];
  responsibleActors: string[];
  sourceCitation: string;
  confidenceLevel: ConfidenceLevel;
  dataNeededFlags: string[];
}

interface PolicyGraphEdge {
  id: string;
  source: string;
  target: string;
  relationship:
    | "contains"
    | "drives"
    | "requires"
    | "depends on"
    | "evidenced by"
    | "blocks";
}

interface PolicyGraph {
  policyId: string;
  policyTitle: string;
  nodes: PolicyGraphNode[];
  edges: PolicyGraphEdge[];
}
```

### Placeholder discipline

Every seed value is intentionally non-authoritative:

| Field | Placeholder |
| --- | --- |
| Title | `[REQUIREMENT TO BE DEFINED BY CLIENT]` |
| Date | `[DATE TO BE SOURCED]` (also `[MILESTONE DATE TO BE SOURCED]`) |
| Source citation | `[SOURCE CITATION TO BE ADDED]` |
| Responsible actor | `[ACTION OWNER TO BE CONFIRMED]` |
| Line of business | `[LINE OF BUSINESS TO BE CONFIRMED]` |
| Confidence | `To be confirmed` |

Placeholder strings are detected by a leading `[` and rendered in italic muted
gray inside the detail rail to make the absence of authoritative content
visually obvious.

## Layout

```
┌───────────────────────────────────────────────────────────────────────────────┐
│  Header: title + legend                                                        │
├───────────────────────────────────────────────────────────────────────────────┤
│  Disclaimer banner: "Prototype. Placeholder content only…"                     │
├──────────┬─────────────────────────────────────────────────────┬───────────────┤
│          │  PolicyTimeline (placeholder ticks, no real dates)  │               │
│ Policy   ├─────────────────────────────────────────────────────┤  DetailRail   │
│ Selector │  Breadcrumbs: All policies / <Policy> / <Node>       │  (Source       │
│ (left    ├─────────────────────────────────────────────────────┤   Serif 4      │
│  nav)    │  FilterBar: Type · LOB · Actor · Confidence          │   headings)   │
│          ├─────────────────────────────────────────────────────┤               │
│          │  GraphCanvas (React Flow)                            │               │
└──────────┴─────────────────────────────────────────────────────┴───────────────┘
```

## Interactions

### Selecting a parent policy
- The left selector lists the four placeholder parent policies.
- Clicking a row makes that policy the active context: the graph re-lays out,
  the timeline re-renders, breadcrumbs reset to the policy root, and any
  selected child node is cleared.

### Exploring the graph
- The graph renders the active policy's nodes filtered by the current filters.
  The Policy root is always visible regardless of filter state — hiding the
  root would orphan its children.
- Layout is a deterministic depth-first tree: root at top, children spread
  horizontally beneath their parent. No force simulation; this keeps the graph
  cognitively legible even when sparse.
- Connectors are thin gray (`#CBD5E1`) `smoothstep` edges with the relationship
  label rendered above the line.

### Clicking a node
- `onNodeClick` sets the selected node id.
- The right-side `DetailRail` populates with: type, title, summary, date,
  affected lines of business, responsible actors, source citation, confidence
  level, and data-needed flags.
- The breadcrumb trail expands to include every ancestor up to the policy root.

### Breadcrumbs
- "All policies" returns to the policy-root view (clears node selection).
- Clicking the policy title clears the selected child while keeping the policy
  context.
- Clicking an ancestor selects it.

### Timeline
- Top horizontal strip showing milestone nodes only.
- Because every milestone date is `[DATE TO BE SOURCED]`, ticks are evenly
  distributed and labeled `—`. We do not invent positions on a real calendar.
- Clicking a tick selects the milestone in the detail rail and highlights it
  in the graph.

### Filtering
- Four dimensions: Type, Line of business, Responsible actor, Confidence.
- Each dimension is a chip group; chips toggle inclusion.
- AND across dimensions, OR within a dimension.
- Empty `linesOfBusiness` / `responsibleActors` selections mean "no filter on
  this dimension" (otherwise the placeholder LOB/actor would hide everything).
- The Policy root is exempt from filtering so the graph never goes empty.
- "Reset filters" restores the initial all-types / all-confidence-levels state.

## Visual system

| Token | Value |
| --- | --- |
| Canvas background | `#FAFAFA` |
| Policy node | `#0B1F3A` (navy) |
| Requirement node | `#475569` (slate) |
| Milestone node | `#C9A24A` (gold) |
| Checklist Action node | `#0F766E` (teal) |
| Source node | `#64748B` (gray) |
| Open Question node | white fill, `#B42318` outline |
| Connector | `#CBD5E1` 1.25px |
| UI typography | Inter |
| Right-rail headings | Source Serif 4 |

The header includes a compact color legend so the type↔color mapping is always
visible.

## Traceability disclaimers (anti-overclaim guardrails)

Because incomplete nested requirements would falsely imply complete capture,
the prototype uses **four** layered disclaimers:

1. **Header subtitle** — "Prototype · placeholder content only · not a
   complete representation".
2. **Persistent amber banner** under the header — every session.
3. **Per-node confidence pill** in the detail rail; nodes default to
   `To be confirmed`, which renders in slate.
4. **Per-field placeholder rendering** — italic muted gray text whenever a
   value begins with `[`.

The intent is that a user cannot mistake the graph for an authoritative source
no matter where they look.

## Open design questions (deliberately not solved here)

- Should the timeline switch to a true date axis once any milestone has a real
  date, or stay in placeholder mode until *all* milestones do?
- Should "Open Question" nodes propagate a "blocked" status up to ancestor
  requirements, dimming them in the graph?
- What is the editorial workflow for promoting a node from `To be confirmed`
  to `Low/Medium/High` — does it require a source citation as a hard gate?
- A graph view is interactive but cognitively heavy. A linked table view (one
  row per requirement, columns for actor / date / source / confidence) would
  likely outperform the graph for compliance review tasks. The graph should be
  treated as a navigation aid, not the primary surface, once content is real.

## Acceptance criteria — verified by this prototype

- [x] User can select a policy and see a graph of nested placeholder nodes.
- [x] User can click a node and see a populated detail rail.
- [x] User can filter graph nodes by type (also LOB, actor, confidence).
- [x] All content uses placeholders.
- [x] No invented dates, citations, obligations, deadlines, or legal
      interpretations.
