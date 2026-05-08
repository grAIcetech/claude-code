export type NodeType =
  | "Policy"
  | "Requirement"
  | "Milestone"
  | "Checklist Action"
  | "Source"
  | "Open Question";

export type ConfidenceLevel = "High" | "Medium" | "Low" | "To be confirmed";

export type Relationship =
  | "contains"
  | "drives"
  | "requires"
  | "depends on"
  | "evidenced by"
  | "blocks";

export interface PolicyGraphNode {
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

export interface PolicyGraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: Relationship;
}

export interface PolicyGraph {
  policyId: string;
  policyTitle: string;
  nodes: PolicyGraphNode[];
  edges: PolicyGraphEdge[];
}

export interface Filters {
  types: NodeType[];
  linesOfBusiness: string[];
  responsibleActors: string[];
  confidenceLevels: ConfidenceLevel[];
}

export const ALL_NODE_TYPES: NodeType[] = [
  "Policy",
  "Requirement",
  "Milestone",
  "Checklist Action",
  "Source",
  "Open Question"
];

export const ALL_CONFIDENCE_LEVELS: ConfidenceLevel[] = [
  "High",
  "Medium",
  "Low",
  "To be confirmed"
];

export const PLACEHOLDER_DATE = "[DATE TO BE SOURCED]";
export const PLACEHOLDER_CITATION = "[SOURCE CITATION TO BE ADDED]";
export const PLACEHOLDER_ACTOR = "[ACTION OWNER TO BE CONFIRMED]";
export const PLACEHOLDER_LOB = "[LINE OF BUSINESS TO BE CONFIRMED]";
