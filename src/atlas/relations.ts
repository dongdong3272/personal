import type {
  AtlasGraph,
  AtlasRelationType,
  RelationLayoutKind,
  RelationMeta,
  RelationRoles,
  RelationStrokeStyle,
} from "../types/atlas";

/** Legacy id → layout when JSON omits `layout` */
const LEGACY_LAYOUT: Record<string, RelationLayoutKind> = {
  parent: "descent",
  adopt: "descent",
  spouse: "union",
  lover: "union",
};

const LEGACY_STYLE: Record<string, RelationStrokeStyle> = {
  parent: "solid",
  spouse: "solid",
  lover: "dashed",
  adopt: "dashed",
};

const LEGACY_BAR: Record<string, string> = {
  spouse: "夫妻",
  lover: "情人",
};

const LEGACY_ROLES: Record<string, RelationRoles> = {
  parent: {
    fromSource: { m: "儿子", f: "女儿", default: "子女" },
    fromTarget: { m: "父亲", f: "母亲", default: "父母" },
  },
  adopt: {
    fromSource: { m: "养子", f: "养女", default: "养子女" },
    fromTarget: { m: "养父", f: "养母", default: "养父母" },
  },
  spouse: {
    either: { m: "丈夫", f: "妻子", default: "配偶" },
  },
  lover: {
    either: { default: "情人" },
  },
  friend: {
    either: { default: "朋友" },
  },
  rival: {
    either: { default: "对手" },
  },
};

function normalizeRelation(rt: AtlasRelationType): RelationMeta {
  const layout =
    rt.layout ?? LEGACY_LAYOUT[rt.id] ?? ("link" as RelationLayoutKind);
  const style = rt.style ?? LEGACY_STYLE[rt.id] ?? "solid";
  const barLabel = rt.barLabel ?? LEGACY_BAR[rt.id] ?? rt.label;
  const roles = rt.roles ?? LEGACY_ROLES[rt.id] ?? {
    either: { default: rt.label },
  };

  return {
    id: rt.id,
    label: rt.label,
    color: rt.color,
    layout,
    style,
    barLabel,
    roles,
  };
}

export type RelationIndex = {
  byId: Map<string, RelationMeta>;
  descentTypes: Set<string>;
  unionTypes: Set<string>;
  linkTypes: Set<string>;
};

export function buildRelationIndex(graph: AtlasGraph): RelationIndex {
  const byId = new Map<string, RelationMeta>();
  for (const rt of graph.relationTypes) {
    byId.set(rt.id, normalizeRelation(rt));
  }

  // Edges may reference types not listed — synthesize link defaults
  for (const e of graph.edges) {
    if (!byId.has(e.type)) {
      byId.set(
        e.type,
        normalizeRelation({
          id: e.type,
          label: e.type,
          color: "#aaa",
        })
      );
    }
  }

  const descentTypes = new Set<string>();
  const unionTypes = new Set<string>();
  const linkTypes = new Set<string>();
  for (const meta of byId.values()) {
    if (meta.layout === "descent") descentTypes.add(meta.id);
    else if (meta.layout === "union") unionTypes.add(meta.id);
    else linkTypes.add(meta.id);
  }

  return { byId, descentTypes, unionTypes, linkTypes };
}

export function getRelationMeta(
  index: RelationIndex,
  typeId: string
): RelationMeta {
  return (
    index.byId.get(typeId) ??
    normalizeRelation({ id: typeId, label: typeId, color: "#aaa" })
  );
}

/** Normalize graph in-place-friendly copy with filled relationTypes */
export function normalizeGraph(graph: AtlasGraph): AtlasGraph {
  const index = buildRelationIndex(graph);
  return {
    ...graph,
    relationTypes: [...index.byId.values()].map((m) => ({
      id: m.id,
      label: m.label,
      color: m.color,
      layout: m.layout,
      style: m.style,
      barLabel: m.barLabel,
      roles: m.roles,
    })),
  };
}
