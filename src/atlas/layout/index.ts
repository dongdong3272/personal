import type { AtlasGraph } from "../../types/atlas";
import { buildRelationIndex } from "../relations";
import type { LaidOutEdge, LaidOutNode } from "./geometry";
import { placeGenerations } from "./placeNodes";
import { routeEdges } from "./routeEdges";

export type { LaidOutEdge, LaidOutNode } from "./geometry";
export { CARD_H, CARD_W } from "../constants";

export type TreeLayout = {
  nodes: LaidOutNode[];
  edges: LaidOutEdge[];
  width: number;
  height: number;
  generations: number[];
};

/** Public API — signature matches the former atlasTreeLayout helper */
export function layoutFamilyTree(graph: AtlasGraph): TreeLayout {
  const index = buildRelationIndex(graph);
  const placement = placeGenerations(graph, index);
  const edges = routeEdges(graph, index, placement.nodes);

  return {
    nodes: placement.nodes,
    edges,
    width: placement.width,
    height: placement.height,
    generations: placement.generations,
  };
}
