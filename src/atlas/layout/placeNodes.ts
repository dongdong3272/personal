import type { AtlasEdge, AtlasGraph, AtlasNode } from "../../types/atlas";
import {
  CARD_H,
  CARD_W,
  COUPLE_GAP,
  H_GAP,
  PAD_X,
  PAD_Y,
  ROW_H,
  SIDE_GUTTER,
} from "../constants";
import type { RelationIndex } from "../relations";
import { getRelationMeta } from "../relations";
import type { LaidOutNode } from "./geometry";
import { undirectedKey } from "./geometry";

function parentsOf(
  id: string,
  edges: AtlasEdge[],
  descentTypes: Set<string>
): string[] {
  return edges
    .filter((e) => descentTypes.has(e.type) && e.target === id)
    .map((e) => e.source);
}

function hasDescentParent(
  id: string,
  edges: AtlasEdge[],
  descentTypes: Set<string>
): boolean {
  return parentsOf(id, edges, descentTypes).length > 0;
}

function childCount(
  id: string,
  edges: AtlasEdge[],
  descentTypes: Set<string>
): number {
  return edges.filter((e) => descentTypes.has(e.type) && e.source === id)
    .length;
}

/** Co-parents of the same child via any descent edge */
export function familyGroups(
  edges: AtlasEdge[],
  descentTypes: Set<string>
): { parentIds: string[]; childIds: string[]; type: string }[] {
  const map = new Map<
    string,
    { parentIds: string[]; childIds: Set<string>; type: string }
  >();

  for (const type of descentTypes) {
    const byChild = new Map<string, string[]>();
    for (const e of edges) {
      if (e.type !== type) continue;
      const list = byChild.get(e.target) ?? [];
      list.push(e.source);
      byChild.set(e.target, list);
    }
    for (const [childId, parents] of byChild) {
      const parentIds = [...new Set(parents)].sort();
      const key = `${type}:${parentIds.join("|")}`;
      let g = map.get(key);
      if (!g) {
        g = { parentIds, childIds: new Set(), type };
        map.set(key, g);
      }
      g.childIds.add(childId);
    }
  }

  return [...map.values()].map((g) => ({
    parentIds: g.parentIds,
    childIds: [...g.childIds],
    type: g.type,
  }));
}

type GenUnion = {
  a: string;
  b: string;
  style: "solid" | "dashed";
};

function genUnions(
  nodeIds: Set<string>,
  edges: AtlasEdge[],
  index: RelationIndex
): GenUnion[] {
  const seen = new Set<string>();
  const out: GenUnion[] = [];
  for (const e of edges) {
    if (!index.unionTypes.has(e.type)) continue;
    if (!nodeIds.has(e.source) || !nodeIds.has(e.target)) continue;
    const key = undirectedKey(e.source, e.target);
    if (seen.has(key)) continue;
    seen.add(key);
    const meta = getRelationMeta(index, e.type);
    out.push({
      a: e.source,
      b: e.target,
      style: meta.style === "dashed" ? "dashed" : "solid",
    });
  }
  return out;
}

function unionPartners(
  id: string,
  unions: GenUnion[]
): string[] {
  const partners: string[] = [];
  for (const u of unions) {
    if (u.a === id) partners.push(u.b);
    else if (u.b === id) partners.push(u.a);
  }
  return partners;
}

function areUnionLinked(a: string, b: string, unions: GenUnion[]): boolean {
  return unions.some(
    (u) => undirectedKey(u.a, u.b) === undirectedKey(a, b)
  );
}

/**
 * Order one generation like a hand-drawn chart:
 * 1) core siblings (descent from prior gen) left→right
 * 2) shared union partners inserted between their partners
 * 3) exclusive partners (esp. solid/spouse) pulled adjacent
 * 4) childless singles nudged outward
 */
function orderGeneration(
  nodes: AtlasNode[],
  edges: AtlasEdge[],
  index: RelationIndex,
  pos: Map<string, { x: number; y: number }>
): string[] {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const nodeIds = new Set(nodes.map((n) => n.id));
  const unions = genUnions(nodeIds, edges, index);

  const parentAnchor = (id: string): number => {
    const xs = parentsOf(id, edges, index.descentTypes)
      .map((p) => pos.get(p)?.x)
      .filter((x): x is number => x != null);
    if (xs.length === 0) return Number.POSITIVE_INFINITY;
    return xs.reduce((a, b) => a + b, 0) / xs.length;
  };

  const isLateralLeaf = (id: string) =>
    unionPartners(id, unions).length === 0 &&
    childCount(id, edges, index.descentTypes) === 0;

  const compareNodes = (a: string, b: string) => {
    const pa = parentAnchor(a);
    const pb = parentAnchor(b);
    if (pa !== pb) return pa - pb;
    // Childless, unpartnered siblings drift right (e.g. 阿玛兰妲)
    const la = isLateralLeaf(a) ? 1 : 0;
    const lb = isLateralLeaf(b) ? 1 : 0;
    if (la !== lb) return la - lb;
    const na = byId.get(a)!;
    const nb = byId.get(b)!;
    if (na.importance !== nb.importance) return nb.importance - na.importance;
    return na.name.localeCompare(nb.name, "zh");
  };

  // Core = has a descent parent, or whole generation if nobody does (gen 1)
  let cores = nodes
    .filter((n) => hasDescentParent(n.id, edges, index.descentTypes))
    .map((n) => n.id);
  if (cores.length === 0) {
    cores = nodes.map((n) => n.id);
  }
  cores.sort(compareNodes);

  const sequence = [...cores];
  const inSeq = new Set(sequence);

  const insertAt = (id: string, indexAt: number) => {
    sequence.splice(indexAt, 0, id);
    inSeq.add(id);
  };

  const removeId = (id: string) => {
    const i = sequence.indexOf(id);
    if (i >= 0) sequence.splice(i, 1);
    inSeq.delete(id);
  };

  // Shared partners (2+ union links into current sequence): place between them
  const candidates = nodes
    .map((n) => n.id)
    .filter((id) => !inSeq.has(id))
    .sort(compareNodes);

  for (const id of candidates) {
    const partners = unionPartners(id, unions).filter((p) => inSeq.has(p));
    if (partners.length < 2) continue;
    const idxs = partners
      .map((p) => sequence.indexOf(p))
      .filter((i) => i >= 0)
      .sort((a, b) => a - b);
    const insertPos = idxs[0] + 1;
    insertAt(id, insertPos);
  }

  // Pull exclusive partners adjacent (solid first)
  /** Place exclusive partner beside anchor, on the side away from other unions */
  const attachPartner = (anchor: string, partner: string) => {
    if (!inSeq.has(anchor)) return;
    if (
      inSeq.has(partner) &&
      Math.abs(sequence.indexOf(anchor) - sequence.indexOf(partner)) === 1
    ) {
      return;
    }
    if (inSeq.has(partner)) removeId(partner);

    const ia = sequence.indexOf(anchor);
    const otherPartnerIdxs = unionPartners(anchor, unions)
      .filter((p) => p !== partner && inSeq.has(p))
      .map((p) => sequence.indexOf(p))
      .filter((i) => i >= 0);

    let insertPos = ia + 1;
    if (otherPartnerIdxs.length > 0) {
      const avg =
        otherPartnerIdxs.reduce((a, b) => a + b, 0) / otherPartnerIdxs.length;
      // Keep existing union cluster intact; put spouse/lover on the outer side
      insertPos = avg >= ia ? ia : ia + 1;
    }
    insertAt(partner, insertPos);
  };

  const solidUnions = unions.filter((u) => u.style === "solid");
  const dashedUnions = unions.filter((u) => u.style === "dashed");

  for (const u of solidUnions) {
    const aIn = inSeq.has(u.a);
    const bIn = inSeq.has(u.b);
    if (aIn && bIn) {
      // Keep higher-importance (or earlier) as anchor
      const na = byId.get(u.a)!;
      const nb = byId.get(u.b)!;
      if (na.importance >= nb.importance) attachPartner(u.a, u.b);
      else attachPartner(u.b, u.a);
    } else if (aIn) attachPartner(u.a, u.b);
    else if (bIn) attachPartner(u.b, u.a);
  }

  for (const u of dashedUnions) {
    const aIn = inSeq.has(u.a);
    const bIn = inSeq.has(u.b);
    if (aIn && bIn) {
      if (Math.abs(sequence.indexOf(u.a) - sequence.indexOf(u.b)) === 1) {
        continue;
      }
      // Don't yank a shared partner out of the middle of multiple partners
      const aPartners = unionPartners(u.a, unions).filter((p) => inSeq.has(p) || p === u.b);
      const bPartners = unionPartners(u.b, unions).filter((p) => inSeq.has(p) || p === u.a);
      if (aPartners.length >= 2 || bPartners.length >= 2) continue;
      const na = byId.get(u.a)!;
      const nb = byId.get(u.b)!;
      if (na.importance >= nb.importance) attachPartner(u.a, u.b);
      else attachPartner(u.b, u.a);
    } else if (aIn) attachPartner(u.a, u.b);
    else if (bIn) attachPartner(u.b, u.a);
  }

  // Anyone still missing (isolated)
  for (const n of [...nodes].sort((a, b) => compareNodes(a.id, b.id))) {
    if (!inSeq.has(n.id)) {
      sequence.push(n.id);
      inSeq.add(n.id);
    }
  }

  return sequence;
}

function gapBetween(
  leftId: string,
  rightId: string,
  unions: GenUnion[]
): number {
  return areUnionLinked(leftId, rightId, unions) ? COUPLE_GAP : H_GAP;
}

export type PlacementResult = {
  nodes: LaidOutNode[];
  generations: number[];
  width: number;
  height: number;
};

export function placeGenerations(
  graph: AtlasGraph,
  index: RelationIndex
): PlacementResult {
  const edges = graph.edges;

  const genMap = new Map<number, AtlasNode[]>();
  for (const node of graph.nodes) {
    const gen = node.generation ?? 1;
    if (!genMap.has(gen)) genMap.set(gen, []);
    genMap.get(gen)!.push(node);
  }
  const generations = [...genMap.keys()].sort((a, b) => a - b);

  const pos = new Map<string, { x: number; y: number }>();
  let maxRight = 0;

  for (const gen of generations) {
    const nodes = genMap.get(gen)!;
    const nodeIds = new Set(nodes.map((n) => n.id));
    const unions = genUnions(nodeIds, edges, index);
    const order = orderGeneration(nodes, edges, index, pos);

    // Ideal start from average parent x of the whole row
    const anchors = order
      .map((id) => {
        const xs = parentsOf(id, edges, index.descentTypes)
          .map((p) => pos.get(p)?.x)
          .filter((x): x is number => x != null);
        if (xs.length === 0) return null;
        return xs.reduce((a, b) => a + b, 0) / xs.length;
      })
      .filter((x): x is number => x != null);

    let totalWidth = 0;
    for (let i = 0; i < order.length; i++) {
      totalWidth += CARD_W;
      if (i < order.length - 1) {
        totalWidth += gapBetween(order[i], order[i + 1], unions);
      }
    }

    const idealCenter =
      anchors.length > 0
        ? anchors.reduce((a, b) => a + b, 0) / anchors.length + CARD_W / 2
        : PAD_X + totalWidth / 2;

    let x = Math.max(PAD_X, idealCenter - totalWidth / 2);
    const y = PAD_Y + (gen - generations[0]) * ROW_H;

    for (let i = 0; i < order.length; i++) {
      const id = order[i];
      pos.set(id, { x, y });
      x += CARD_W;
      if (i < order.length - 1) {
        x += gapBetween(id, order[i + 1], unions);
      }
    }
    maxRight = Math.max(maxRight, x + H_GAP);
  }

  const width = Math.max(maxRight + PAD_X + SIDE_GUTTER, 720) + SIDE_GUTTER;
  const height =
    PAD_Y +
    (generations.length > 0
      ? (generations[generations.length - 1] - generations[0]) * ROW_H
      : 0) +
    CARD_H +
    PAD_Y;

  const laidNodes: LaidOutNode[] = graph.nodes.map((n) => {
    const p = pos.get(n.id) ?? { x: PAD_X, y: PAD_Y };
    return {
      ...n,
      x: p.x,
      y: p.y,
      cx: p.x + CARD_W / 2,
      cy: p.y + CARD_H / 2,
    };
  });

  return { nodes: laidNodes, generations, width, height };
}
