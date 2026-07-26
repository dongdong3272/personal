import type { AtlasGraph, AtlasIndexEntry } from "../types/atlas";
import { normalizeGraph } from "../atlas/relations";
import atlasIndex from "../data/atlas/index.json";

const graphModules = import.meta.glob("../data/atlas/*.json", {
  eager: true,
  import: "default",
}) as Record<string, AtlasGraph | AtlasIndexEntry[]>;

function buildGraphMap(): Record<string, AtlasGraph> {
  const map: Record<string, AtlasGraph> = {};
  for (const [path, data] of Object.entries(graphModules)) {
    if (path.endsWith("/index.json")) continue;
    const graph = data as AtlasGraph;
    if (graph?.id) {
      map[graph.id] = normalizeGraph(graph);
    }
  }
  return map;
}

const graphs = buildGraphMap();

export function getAtlasIndex(): AtlasIndexEntry[] {
  return atlasIndex as AtlasIndexEntry[];
}

export function getAtlasGraph(id: string): AtlasGraph | null {
  return graphs[id] ?? null;
}

export function listAtlasGraphIds(): string[] {
  return Object.keys(graphs);
}
