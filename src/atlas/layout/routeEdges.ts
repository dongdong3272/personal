import type { AtlasEdge, AtlasGraph } from "../../types/atlas";
import { CARD_H, CARD_W } from "../constants";
import { descentChildLabel } from "../labels";
import type { RelationIndex } from "../relations";
import { getRelationMeta } from "../relations";
import {
  areAdjacentCards,
  arcAbovePath,
  midBarPath,
  pushEdge,
  undirectedKey,
  type LaidOutEdge,
  type LaidOutNode,
} from "./geometry";
import { familyGroups } from "./placeNodes";

function findUnion(
  a: string,
  b: string,
  edges: AtlasEdge[],
  unionTypes: Set<string>
): AtlasEdge | null {
  for (const e of edges) {
    if (!unionTypes.has(e.type)) continue;
    if (undirectedKey(e.source, e.target) === undirectedKey(a, b)) {
      return e;
    }
  }
  return null;
}

export function routeEdges(
  graph: AtlasGraph,
  index: RelationIndex,
  laidNodes: LaidOutNode[]
): LaidOutEdge[] {
  const laidById = new Map(laidNodes.map((n) => [n.id, n]));
  const edges = graph.edges;
  const laidEdges: LaidOutEdge[] = [];
  const unionDrawn = new Set<string>();

  const drawMidBar = (
    a: LaidOutNode,
    b: LaidOutNode,
    type: string,
    label: string
  ) => {
    const geom = midBarPath(a, b);
    pushEdge(laidEdges, {
      source: a.id,
      target: b.id,
      type,
      label,
      path: geom.path,
      labelX: geom.labelX,
      labelY: geom.labelY,
      showLabel: true,
    });
  };

  // 1) Adjacent union mid-bars (solid first, then dashed)
  const unionEdges = edges
    .filter((e) => index.unionTypes.has(e.type))
    .sort((a, b) => {
      const sa = getRelationMeta(index, a.type).style === "solid" ? 0 : 1;
      const sb = getRelationMeta(index, b.type).style === "solid" ? 0 : 1;
      return sa - sb;
    });

  for (const edge of unionEdges) {
    const key = undirectedKey(edge.source, edge.target);
    if (unionDrawn.has(key)) continue;
    const a = laidById.get(edge.source);
    const b = laidById.get(edge.target);
    if (!a || !b || !areAdjacentCards(a, b)) continue;
    const meta = getRelationMeta(index, edge.type);
    unionDrawn.add(key);
    drawMidBar(a, b, edge.type, edge.label || meta.barLabel);
  }

  // 2) Descent: stem / under-bus / drops
  for (const group of familyGroups(edges, index.descentTypes)) {
    const parents = group.parentIds
      .map((id) => laidById.get(id))
      .filter((n): n is LaidOutNode => !!n)
      .sort((a, b) => a.x - b.x);
    const children = group.childIds
      .map((id) => laidById.get(id))
      .filter((n): n is LaidOutNode => !!n)
      .sort((a, b) => a.x - b.x);

    if (parents.length === 0 || children.length === 0) continue;

    let stemX: number;
    let stemTopY: number;
    const primaryParent = parents[0].id;
    const primaryChild = children[0].id;

    if (parents.length >= 2) {
      const [p0, p1] = parents;
      const key = undirectedKey(p0.id, p1.id);
      const union = findUnion(p0.id, p1.id, edges, index.unionTypes);
      const adjacent = areAdjacentCards(p0, p1);

      if (union && adjacent) {
        if (!unionDrawn.has(key)) {
          const meta = getRelationMeta(index, union.type);
          drawMidBar(p0, p1, union.type, union.label || meta.barLabel);
          unionDrawn.add(key);
        }
        stemX = (p0.x + CARD_W + p1.x) / 2;
        stemTopY = p0.cy;
      } else {
        // Under-bus so the child line is never headless
        const underY = Math.max(p0.y, p1.y) + CARD_H + 20;
        stemX = (p0.cx + p1.cx) / 2;
        stemTopY = underY;

        pushEdge(laidEdges, {
          source: p0.id,
          target: primaryChild,
          type: group.type,
          label: "",
          path: `M ${p0.cx} ${p0.y + CARD_H} L ${p0.cx} ${underY} L ${stemX} ${underY}`,
          labelX: p0.cx,
          labelY: underY,
          showLabel: false,
        });
        pushEdge(laidEdges, {
          source: p1.id,
          target: primaryChild,
          type: group.type,
          label: "",
          path: `M ${p1.cx} ${p1.y + CARD_H} L ${p1.cx} ${underY} L ${stemX} ${underY}`,
          labelX: p1.cx,
          labelY: underY,
          showLabel: false,
        });

        if (union && !unionDrawn.has(key)) {
          unionDrawn.add(key);
          const meta = getRelationMeta(index, union.type);
          pushEdge(laidEdges, {
            source: p0.id,
            target: p1.id,
            type: union.type,
            label: union.label || meta.barLabel,
            path: `M ${p0.cx} ${underY} L ${p1.cx} ${underY}`,
            labelX: stemX,
            labelY: underY - 8,
            showLabel: true,
          });
        }
      }
    } else {
      stemX = parents[0].cx;
      stemTopY = parents[0].y + CARD_H;
    }

    const childTop = Math.min(...children.map((c) => c.y));
    const busY = stemTopY + Math.max(16, (childTop - stemTopY) * 0.45);
    const busLeft = Math.min(...children.map((c) => c.cx));
    const busRight = Math.max(...children.map((c) => c.cx));

    pushEdge(laidEdges, {
      source: primaryParent,
      target: primaryChild,
      type: group.type,
      label: "",
      path: `M ${stemX} ${stemTopY} L ${stemX} ${busY}`,
      labelX: stemX,
      labelY: busY,
      showLabel: false,
    });

    if (children.length > 1) {
      pushEdge(laidEdges, {
        source: primaryParent,
        target: primaryChild,
        type: group.type,
        label: "",
        path: `M ${busLeft} ${busY} L ${busRight} ${busY}`,
        labelX: (busLeft + busRight) / 2,
        labelY: busY,
        showLabel: false,
      });
    } else if (Math.abs(stemX - children[0].cx) > 1) {
      pushEdge(laidEdges, {
        source: primaryParent,
        target: children[0].id,
        type: group.type,
        label: "",
        path: `M ${stemX} ${busY} L ${children[0].cx} ${busY}`,
        labelX: (stemX + children[0].cx) / 2,
        labelY: busY,
        showLabel: false,
      });
    }

    for (const child of children) {
      pushEdge(laidEdges, {
        source: primaryParent,
        target: child.id,
        type: group.type,
        label: descentChildLabel(child, group.type, index),
        path: `M ${child.cx} ${busY} L ${child.cx} ${child.y}`,
        labelX: child.cx,
        labelY: child.y - 8,
        showLabel: true,
      });
    }
  }

  // 3) Remaining undrawn union → arc above
  let arcLane = 0;
  for (const edge of edges) {
    if (!index.unionTypes.has(edge.type)) continue;
    const key = undirectedKey(edge.source, edge.target);
    if (unionDrawn.has(key)) continue;

    const a = laidById.get(edge.source);
    const b = laidById.get(edge.target);
    if (!a || !b) continue;

    unionDrawn.add(key);
    const meta = getRelationMeta(index, edge.type);
    const geom = arcAbovePath(a, b, arcLane++);
    pushEdge(laidEdges, {
      source: edge.source,
      target: edge.target,
      type: edge.type,
      label: edge.label || meta.barLabel,
      path: geom.path,
      labelX: geom.labelX,
      labelY: geom.labelY,
      showLabel: true,
    });
  }

  // layout === "link" → no tree geometry

  return laidEdges;
}
