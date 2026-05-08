import { NodeType } from "./types";

export interface NodeStyle {
  bg: string;
  fg: string;
  border: string;
  label: string;
  swatchClass: string; // tailwind utility class for legend swatches
}

export const NODE_STYLES: Record<NodeType, NodeStyle> = {
  Policy: {
    bg: "#0B1F3A",
    fg: "#FFFFFF",
    border: "#0B1F3A",
    label: "Policy",
    swatchClass: "bg-policy"
  },
  Requirement: {
    bg: "#475569",
    fg: "#FFFFFF",
    border: "#475569",
    label: "Requirement",
    swatchClass: "bg-requirement"
  },
  Milestone: {
    bg: "#C9A24A",
    fg: "#1F1300",
    border: "#C9A24A",
    label: "Milestone",
    swatchClass: "bg-milestone"
  },
  "Checklist Action": {
    bg: "#0F766E",
    fg: "#FFFFFF",
    border: "#0F766E",
    label: "Checklist Action",
    swatchClass: "bg-action"
  },
  Source: {
    bg: "#64748B",
    fg: "#FFFFFF",
    border: "#64748B",
    label: "Source",
    swatchClass: "bg-source"
  },
  "Open Question": {
    bg: "#FFFFFF",
    fg: "#B42318",
    border: "#B42318",
    label: "Open Question",
    swatchClass: "border-2 border-question bg-white"
  }
};
