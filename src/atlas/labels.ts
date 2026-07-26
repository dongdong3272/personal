import type { AtlasEdge, AtlasNode, GenderedLabel, RelationMeta } from "../types/atlas";
import type { RelationIndex } from "./relations";
import { getRelationMeta } from "./relations";

function pickGendered(spec: GenderedLabel | undefined, gender?: "m" | "f"): string {
  if (!spec) return "";
  if (gender === "m" && spec.m) return spec.m;
  if (gender === "f" && spec.f) return spec.f;
  return spec.default;
}

/** Drawer label: concrete role from viewer's perspective */
export function roleLabel(
  from: AtlasNode,
  edge: AtlasEdge,
  other: AtlasNode,
  meta: RelationMeta
): string {
  const { roles } = meta;

  if (meta.layout === "descent" && roles.fromSource && roles.fromTarget) {
    if (from.id === edge.source) {
      return pickGendered(roles.fromSource, other.gender);
    }
    return pickGendered(roles.fromTarget, other.gender);
  }

  if (roles.either) {
    return pickGendered(roles.either, other.gender);
  }

  if (roles.fromSource && from.id === edge.source) {
    return pickGendered(roles.fromSource, other.gender);
  }
  if (roles.fromTarget && from.id === edge.target) {
    return pickGendered(roles.fromTarget, other.gender);
  }

  return edge.label || meta.label || edge.type;
}

export function edgeDisplayLabel(
  from: AtlasNode,
  edge: AtlasEdge,
  other: AtlasNode,
  index: RelationIndex
): string {
  const meta = getRelationMeta(index, edge.type);
  return `${roleLabel(from, edge, other, meta)} · ${other.name}`;
}

/** Label above a child on a descent drop */
export function descentChildLabel(
  child: AtlasNode,
  edgeType: string,
  index: RelationIndex
): string {
  const meta = getRelationMeta(index, edgeType);
  // Legacy / demo parity: adopt drops show「收养」rather than 养子/养女
  if (meta.id === "adopt") {
    return meta.barLabel || "收养";
  }
  if (meta.roles.fromSource) {
    return pickGendered(meta.roles.fromSource, child.gender);
  }
  return meta.barLabel || meta.label;
}

/** Sort key for drawer relation list: descent → union → link */
export function relationSortRank(
  typeId: string,
  index: RelationIndex
): number {
  const meta = getRelationMeta(index, typeId);
  if (meta.layout === "descent") return 0;
  if (meta.layout === "union") return 1;
  return 2;
}
