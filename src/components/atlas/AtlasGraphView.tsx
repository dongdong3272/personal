import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { AtlasGraph, AtlasNode, RelationMeta } from "../../types/atlas";
import {
  CARD_H,
  CARD_W,
  layoutFamilyTree,
  type LaidOutNode,
} from "../../atlas/layout";
import { buildRelationIndex, getRelationMeta } from "../../atlas/relations";
import "./AtlasGraphView.css";

export type AtlasGraphViewProps = {
  graph: AtlasGraph;
  selectedNodeId: string | null;
  focusNodeId: string | null;
  onSelectNode: (node: AtlasNode | null) => void;
  onFocusConsumed: () => void;
};

function edgeStroke(meta: RelationMeta): {
  width: number;
  dash: string | null;
  opacity: number;
} {
  if (meta.layout === "union" && meta.style === "solid") {
    return { width: 2.2, dash: null, opacity: 0.9 };
  }
  if (meta.style === "dashed") {
    return {
      width: 1.5,
      dash: meta.layout === "union" ? "4 4" : "5 4",
      opacity: meta.layout === "union" ? 0.8 : 0.7,
    };
  }
  return { width: 1.6, dash: null, opacity: 0.75 };
}

const CARD_H_NAME = 44;
const CARD_H_SUMMARY = 58;
const CARD_H_KEYWORDS = 76;

const AtlasGraphView = ({
  graph,
  selectedNodeId,
  focusNodeId,
  onSelectNode,
  onFocusConsumed,
}: AtlasGraphViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const nodesRef = useRef<LaidOutNode[]>([]);
  const onSelectRef = useRef(onSelectNode);
  onSelectRef.current = onSelectNode;

  useEffect(() => {
    const container = containerRef.current;
    const svgEl = svgRef.current;
    if (!container || !svgEl) return;

    const layout = layoutFamilyTree(graph);
    nodesRef.current = layout.nodes;

    const relationIndex = buildRelationIndex(graph);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const defs = svg.append("defs");
    defs
      .append("clipPath")
      .attr("id", "atlas-card-clip")
      .append("rect")
      .attr("width", CARD_W)
      .attr("height", CARD_H_KEYWORDS)
      .attr("rx", 10)
      .attr("ry", 10);

    const root = svg.append("g").attr("class", "atlas-zoom-root");

    const genLabelLayer = root.append("g").attr("class", "atlas-gen-labels");
    for (const gen of layout.generations) {
      const sample = layout.nodes.find((n) => (n.generation ?? 1) === gen);
      if (!sample) continue;
      genLabelLayer
        .append("text")
        .attr("class", "atlas-gen-label")
        .attr("x", 20)
        .attr("y", sample.y + CARD_H / 2 + 4)
        .text(`第 ${gen} 代`);
    }

    const linkLayer = root.append("g").attr("class", "atlas-links");
    const nodeLayer = root.append("g").attr("class", "atlas-nodes");

    const link = linkLayer
      .selectAll<SVGGElement, (typeof layout.edges)[number]>("g")
      .data(layout.edges)
      .join("g")
      .attr("class", (d) => `atlas-link-group atlas-link-${d.type}`);

    link
      .append("path")
      .attr("class", "atlas-link")
      .attr("d", (d) => d.path)
      .attr("fill", "none")
      .attr("stroke", (d) => getRelationMeta(relationIndex, d.type).color)
      .attr("stroke-width", (d) =>
        edgeStroke(getRelationMeta(relationIndex, d.type)).width
      )
      .attr("stroke-opacity", (d) =>
        edgeStroke(getRelationMeta(relationIndex, d.type)).opacity
      )
      .attr("stroke-dasharray", (d) =>
        edgeStroke(getRelationMeta(relationIndex, d.type)).dash
      );

    link
      .filter((d) => d.showLabel && !!d.label)
      .append("text")
      .attr("class", "atlas-edge-label")
      .attr("x", (d) => d.labelX)
      .attr("y", (d) => d.labelY)
      .attr("text-anchor", "middle")
      .attr("fill", (d) => getRelationMeta(relationIndex, d.type).color)
      .text((d) => d.label);

    const node = nodeLayer
      .selectAll<SVGGElement, LaidOutNode>("g")
      .data(layout.nodes, (d) => d.id)
      .join("g")
      .attr("class", "atlas-node")
      .attr("data-id", (d) => d.id)
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .attr("clip-path", "url(#atlas-card-clip)")
      .style("cursor", "pointer");

    node
      .append("rect")
      .attr("class", "atlas-node-card")
      .attr("width", CARD_W)
      .attr("height", CARD_H_NAME)
      .attr("rx", 10)
      .attr("ry", 10);

    // Only name / summary / keywords — never bind `detail`
    node
      .append("text")
      .attr("class", "atlas-node-name")
      .attr("x", CARD_W / 2)
      .attr("y", 28)
      .attr("text-anchor", "middle")
      .text((d) => d.name);

    node
      .append("text")
      .attr("class", "atlas-node-summary")
      .attr("x", CARD_W / 2)
      .attr("y", 42)
      .attr("text-anchor", "middle")
      .attr("display", "none")
      .text((d) => {
        const s = d.summary ?? "";
        return s.length > 14 ? `${s.slice(0, 14)}…` : s;
      });

    node
      .append("text")
      .attr("class", "atlas-node-keywords")
      .attr("x", CARD_W / 2)
      .attr("y", 60)
      .attr("text-anchor", "middle")
      .attr("display", "none")
      .text((d) => (d.keywords ? d.keywords.slice(0, 3).join(" · ") : ""));

    let fitK = 1;

    // Relative to fit zoom: far=name, mid=+title, near=+keywords
    function applyLod(k: number) {
      const rel = k / Math.max(fitK, 0.01);
      const showSummary = rel >= 1.25;
      const showKeywords = rel >= 2.0;

      node.each(function (d) {
        const g = d3.select(this);
        const h =
          showKeywords && d.keywords?.length
            ? CARD_H_KEYWORDS
            : showSummary && d.summary
              ? CARD_H_SUMMARY
              : CARD_H_NAME;

        g.select(".atlas-node-card").attr("height", h).attr("width", CARD_W);
        g.attr("transform", `translate(${d.x},${d.y})`);

        g.select(".atlas-node-name").attr("y", showSummary ? 22 : h / 2 + 5);

        g.select(".atlas-node-summary")
          .attr("display", showSummary && d.summary ? null : "none");

        g.select(".atlas-node-keywords")
          .attr(
            "display",
            showKeywords && d.keywords?.length ? null : "none"
          );
      });
    }

    node.on("click", (event, d) => {
      event.stopPropagation();
      onSelectRef.current(d);
    });

    svg.on("click", () => onSelectRef.current(null));

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 2.8])
      .on("zoom", (event) => {
        root.attr("transform", event.transform.toString());
        applyLod(event.transform.k);
      });

    zoomRef.current = zoom;
    svg.call(zoom);

    fitK = Math.min(
      1,
      (width - 48) / layout.width,
      (height - 48) / layout.height
    );
    const tx = (width - layout.width * fitK) / 2;
    const ty = Math.max(12, (height - layout.height * fitK) / 2);
    const initial = d3.zoomIdentity.translate(tx, ty).scale(fitK);
    svg.call(zoom.transform, initial);
    applyLod(fitK);

    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      svg.attr("viewBox", `0 0 ${w} ${h}`);
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      zoomRef.current = null;
      svg.on("click", null);
      svg.selectAll("*").remove();
    };
  }, [graph]);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    d3.select(svgEl)
      .selectAll<SVGGElement, LaidOutNode>(".atlas-node")
      .classed("is-selected", (d) => d.id === selectedNodeId);
  }, [selectedNodeId]);

  useEffect(() => {
    if (
      !focusNodeId ||
      !svgRef.current ||
      !zoomRef.current ||
      !containerRef.current
    )
      return;

    const node = nodesRef.current.find((n) => n.id === focusNodeId);
    if (!node) {
      onFocusConsumed();
      return;
    }

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const scale = 1.35;
    const transform = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(scale)
      .translate(-(node.cx), -(node.cy));

    const zoom = zoomRef.current;
    d3.select(svgRef.current)
      .transition()
      .duration(500)
      .call(zoom.transform.bind(zoom), transform);

    onFocusConsumed();
  }, [focusNodeId, onFocusConsumed]);

  return (
    <div className="atlas-graph-view" ref={containerRef}>
      <svg
        ref={svgRef}
        className="atlas-graph-svg"
        role="img"
        aria-label="家族谱系图"
      />
    </div>
  );
};

export default AtlasGraphView;
