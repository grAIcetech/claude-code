# Policy Graph Prototype

Placeholder Next.js prototype: nested policy timeline with deep-click
knowledge graph.

> Every policy, requirement, milestone, date, citation, owner, and obligation
> in this prototype is a non-authoritative placeholder. The graph is
> intentionally incomplete and must not be relied on for legal or compliance
> interpretation.

See [`SPEC.md`](./SPEC.md) for the full interaction spec.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- React Flow for the node graph

## Run locally

```bash
cd prototype/policy-graph
npm install
npm run dev
# open http://localhost:3000
```

Type-check only:

```bash
npm run typecheck
```

## Layout

- Top: horizontal placeholder timeline (milestone ticks, no real dates).
- Left: policy selector (CAA / FTC / IRA / Final Rule placeholders).
- Center: React Flow graph canvas with breadcrumbs and filter bar above.
- Right: detail rail (Source Serif 4 headings) populated on node click.

## What's in scope

- Data model (`lib/types.ts`).
- Seed graphs with placeholder children (`lib/seedData.ts`).
- Layout shell with breadcrumb / filter / detail interactions.

## What's not

- No production database, no auth, no export, no real citations, no automated
  legal reasoning, no claim of completeness.
