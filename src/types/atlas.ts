export type AtlasStatus = "demo" | "wip" | "ready";

export type AtlasImportance = 1 | 2 | 3 | 4 | 5;

/** How the layout engine treats this relation */
export type RelationLayoutKind = "descent" | "union" | "link";

export type RelationStrokeStyle = "solid" | "dashed";

export type GenderedLabel = {
  m?: string;
  f?: string;
  default: string;
};

/**
 * Perspective labels for the drawer:
 * - fromSource: viewer is edge.source looking at target
 * - fromTarget: viewer is edge.target looking at source
 * - either: undirected (union/link) — pick by the *other* person's gender
 */
export type RelationRoles = {
  fromSource?: GenderedLabel;
  fromTarget?: GenderedLabel;
  either?: GenderedLabel;
};

export type AtlasRelationType = {
  id: string;
  label: string;
  color: string;
  /** Required for new data; service fills defaults for legacy JSON */
  layout?: RelationLayoutKind;
  style?: RelationStrokeStyle;
  /** Default label drawn on a union mid-bar / under-bus */
  barLabel?: string;
  roles?: RelationRoles;
};

export type AtlasNode = {
  id: string;
  name: string;
  generation?: number;
  gender?: "m" | "f";
  importance: AtlasImportance;
  tags?: string[];
  summary?: string;
  detail?: string;
  keywords?: string[];
  quote?: string;
};

export type AtlasEdge = {
  source: string;
  target: string;
  type: string;
  label?: string;
};

export type AtlasGraph = {
  id: string;
  title: string;
  workTitle: string;
  description?: string;
  relationTypes: AtlasRelationType[];
  nodes: AtlasNode[];
  edges: AtlasEdge[];
};

export type AtlasIndexEntry = {
  id: string;
  title: string;
  subtitle: string;
  cover?: string;
  workTitle: string;
  nodeCount: number;
  status: AtlasStatus;
};

/** Resolved relation meta used by layout + UI */
export type RelationMeta = Required<
  Pick<AtlasRelationType, "id" | "label" | "color" | "layout" | "style">
> & {
  barLabel: string;
  roles: RelationRoles;
};
