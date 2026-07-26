import type { AtlasNode } from "../../types/atlas";
import { CARD_W } from "../constants";

export type LaidOutNode = AtlasNode & {
  x: number;
  y: number;
  cx: number;
  cy: number;
};

export type LaidOutEdge = {
  source: string;
  target: string;
  type: string;
  path: string;
  labelX: number;
  labelY: number;
  showLabel: boolean;
  label: string;
};

export function undirectedKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export function cardGap(a: LaidOutNode, b: LaidOutNode): number {
  const left = a.x <= b.x ? a : b;
  const right = a.x <= b.x ? b : a;
  return right.x - (left.x + CARD_W);
}

export function areAdjacentCards(a: LaidOutNode, b: LaidOutNode): boolean {
  if (Math.abs(a.y - b.y) > 8) return false;
  const gap = cardGap(a, b);
  return gap >= 0 && gap <= 90;
}

export function midBarPath(
  a: LaidOutNode,
  b: LaidOutNode
): { path: string; labelX: number; labelY: number; y: number } {
  const left = a.x <= b.x ? a : b;
  const right = a.x <= b.x ? b : a;
  const y = left.cy;
  return {
    path: `M ${left.x + CARD_W} ${y} L ${right.x} ${y}`,
    labelX: (left.x + CARD_W + right.x) / 2,
    labelY: y - 10,
    y,
  };
}

export function arcAbovePath(
  a: LaidOutNode,
  b: LaidOutNode,
  lane: number
): { path: string; labelX: number; labelY: number } {
  const overY = Math.min(a.y, b.y) - 28 - lane * 18;
  return {
    path: [
      `M ${a.cx} ${a.y}`,
      `L ${a.cx} ${overY}`,
      `L ${b.cx} ${overY}`,
      `L ${b.cx} ${b.y}`,
    ].join(" "),
    labelX: (a.cx + b.cx) / 2,
    labelY: overY - 6,
  };
}

export function pushEdge(edges: LaidOutEdge[], partial: LaidOutEdge): void {
  edges.push(partial);
}
