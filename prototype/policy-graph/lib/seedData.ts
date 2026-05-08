import {
  PLACEHOLDER_ACTOR,
  PLACEHOLDER_CITATION,
  PLACEHOLDER_DATE,
  PLACEHOLDER_LOB,
  PolicyGraph
} from "./types";

/**
 * Seed graphs are placeholder-only. No real regulatory content, no invented
 * dates, citations, obligations, deadlines, or legal interpretations. Every
 * field is intentionally a placeholder string until a client SME provides
 * authoritative content.
 */

function placeholderRequirement(
  policyId: string,
  index: number
): PolicyGraph["nodes"][number] {
  return {
    id: `${policyId}-req-${index}`,
    parentId: policyId,
    type: "Requirement",
    title: "[REQUIREMENT TO BE DEFINED BY CLIENT]",
    summary:
      "Placeholder requirement. Scope, applicability, and obligation language to be supplied by client SME.",
    date: PLACEHOLDER_DATE,
    affectedLinesOfBusiness: [PLACEHOLDER_LOB],
    responsibleActors: [PLACEHOLDER_ACTOR],
    sourceCitation: PLACEHOLDER_CITATION,
    confidenceLevel: "To be confirmed",
    dataNeededFlags: [
      "Obligation text not sourced",
      "Applicability not confirmed"
    ]
  };
}

function placeholderMilestone(
  policyId: string,
  reqId: string,
  index: number
): PolicyGraph["nodes"][number] {
  return {
    id: `${policyId}-mil-${index}`,
    parentId: reqId,
    type: "Milestone",
    title: "[MILESTONE DATE TO BE SOURCED]",
    summary:
      "Placeholder milestone. Effective date / deadline to be sourced from authoritative citation.",
    date: PLACEHOLDER_DATE,
    affectedLinesOfBusiness: [PLACEHOLDER_LOB],
    responsibleActors: [PLACEHOLDER_ACTOR],
    sourceCitation: PLACEHOLDER_CITATION,
    confidenceLevel: "To be confirmed",
    dataNeededFlags: ["Effective date not sourced"]
  };
}

function placeholderAction(
  reqId: string,
  index: number
): PolicyGraph["nodes"][number] {
  return {
    id: `${reqId}-act-${index}`,
    parentId: reqId,
    type: "Checklist Action",
    title: "[CHECKLIST ACTION TO BE DEFINED]",
    summary:
      "Placeholder operational action. Owner, cadence, and evidence to be confirmed.",
    affectedLinesOfBusiness: [PLACEHOLDER_LOB],
    responsibleActors: [PLACEHOLDER_ACTOR],
    sourceCitation: PLACEHOLDER_CITATION,
    confidenceLevel: "To be confirmed",
    dataNeededFlags: ["Owner not assigned", "Cadence not defined"]
  };
}

function placeholderSource(
  reqId: string,
  index: number
): PolicyGraph["nodes"][number] {
  return {
    id: `${reqId}-src-${index}`,
    parentId: reqId,
    type: "Source",
    title: "[SOURCE CITATION TO BE ADDED]",
    summary:
      "Placeholder source. Authoritative citation, version, and effective date to be added.",
    affectedLinesOfBusiness: [PLACEHOLDER_LOB],
    responsibleActors: [PLACEHOLDER_ACTOR],
    sourceCitation: PLACEHOLDER_CITATION,
    confidenceLevel: "To be confirmed",
    dataNeededFlags: ["Citation pending"]
  };
}

function placeholderQuestion(
  reqId: string,
  index: number
): PolicyGraph["nodes"][number] {
  return {
    id: `${reqId}-q-${index}`,
    parentId: reqId,
    type: "Open Question",
    title: "[OPEN QUESTION FOR CLIENT REVIEW]",
    summary:
      "Placeholder open question. Awaiting clarification before this branch can be marked complete.",
    affectedLinesOfBusiness: [PLACEHOLDER_LOB],
    responsibleActors: [PLACEHOLDER_ACTOR],
    sourceCitation: PLACEHOLDER_CITATION,
    confidenceLevel: "To be confirmed",
    dataNeededFlags: ["Awaiting client response"]
  };
}

function buildPolicy(
  policyId: string,
  policyTitle: string,
  childCount: number
): PolicyGraph {
  const nodes: PolicyGraph["nodes"] = [];
  const edges: PolicyGraph["edges"] = [];

  nodes.push({
    id: policyId,
    type: "Policy",
    title: policyTitle,
    summary:
      "Placeholder parent policy. No legal interpretation, scope, or obligations represented. All children are illustrative placeholders.",
    affectedLinesOfBusiness: [PLACEHOLDER_LOB],
    responsibleActors: [PLACEHOLDER_ACTOR],
    sourceCitation: PLACEHOLDER_CITATION,
    confidenceLevel: "To be confirmed",
    dataNeededFlags: ["Policy scope not confirmed", "Effective version pending"]
  });

  for (let i = 1; i <= childCount; i++) {
    const req = placeholderRequirement(policyId, i);
    nodes.push(req);
    edges.push({
      id: `${policyId}->${req.id}`,
      source: policyId,
      target: req.id,
      relationship: "contains"
    });

    // Each requirement gets a milestone, an action, a source, and (for one) an open question.
    const mil = placeholderMilestone(policyId, req.id, i);
    nodes.push(mil);
    edges.push({
      id: `${req.id}->${mil.id}`,
      source: req.id,
      target: mil.id,
      relationship: "drives"
    });

    const act = placeholderAction(req.id, 1);
    nodes.push(act);
    edges.push({
      id: `${req.id}->${act.id}`,
      source: req.id,
      target: act.id,
      relationship: "requires"
    });

    const src = placeholderSource(req.id, 1);
    nodes.push(src);
    edges.push({
      id: `${req.id}->${src.id}`,
      source: req.id,
      target: src.id,
      relationship: "evidenced by"
    });

    if (i === 1) {
      const q = placeholderQuestion(req.id, 1);
      nodes.push(q);
      edges.push({
        id: `${req.id}->${q.id}`,
        source: req.id,
        target: q.id,
        relationship: "blocks"
      });
    }
  }

  return { policyId, policyTitle, nodes, edges };
}

export const POLICY_GRAPHS: PolicyGraph[] = [
  buildPolicy("caa-placeholder", "CAA Placeholder", 4),
  buildPolicy("ftc-placeholder", "FTC Placeholder", 3),
  buildPolicy("ira-placeholder", "IRA Placeholder", 5),
  buildPolicy("final-rule-placeholder", "Final Rule Placeholder", 3)
];

export function getPolicyById(id: string): PolicyGraph | undefined {
  return POLICY_GRAPHS.find((p) => p.policyId === id);
}
