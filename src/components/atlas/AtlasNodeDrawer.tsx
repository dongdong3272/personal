import type { AtlasGraph, AtlasNode } from "../../types/atlas";
import { edgeDisplayLabel, relationSortRank } from "../../atlas/labels";
import { buildRelationIndex } from "../../atlas/relations";
import "./AtlasNodeDrawer.css";

type AtlasNodeDrawerProps = {
  graph: AtlasGraph;
  node: AtlasNode | null;
  onClose: () => void;
  onSelectRelated: (nodeId: string) => void;
};

const AtlasNodeDrawer = ({
  graph,
  node,
  onClose,
  onSelectRelated,
}: AtlasNodeDrawerProps) => {
  if (!node) return null;

  const index = buildRelationIndex(graph);
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  const relatedEdges = graph.edges
    .filter((e) => e.source === node.id || e.target === node.id)
    .sort(
      (a, b) =>
        relationSortRank(a.type, index) - relationSortRank(b.type, index)
    );

  return (
    <aside className="atlas-drawer" aria-label="人物详情">
      <button
        type="button"
        className="atlas-drawer-close"
        onClick={onClose}
        aria-label="关闭"
      >
        <span className="atlas-drawer-close-icon" aria-hidden="true">
          ×
        </span>
      </button>
      <p className="atlas-drawer-eyebrow">
        {node.generation != null ? `第 ${node.generation} 代` : "人物"}
        {node.tags?.length ? ` · ${node.tags.join(" · ")}` : ""}
      </p>
      <h2 className="atlas-drawer-name">{node.name}</h2>
      {node.summary && <p className="atlas-drawer-summary">{node.summary}</p>}
      {node.detail && <p className="atlas-drawer-detail">{node.detail}</p>}
      {node.quote && (
        <blockquote className="atlas-drawer-quote">“{node.quote}”</blockquote>
      )}
      {node.keywords && node.keywords.length > 0 && (
        <div className="atlas-drawer-keywords">
          {node.keywords.map((k) => (
            <span key={k} className="atlas-keyword">
              {k}
            </span>
          ))}
        </div>
      )}
      <h3 className="atlas-drawer-section">人物关系</h3>
      <ul className="atlas-drawer-relations">
        {relatedEdges.length === 0 && (
          <li className="atlas-drawer-empty">暂无关系边</li>
        )}
        {relatedEdges.map((edge, i) => {
          const otherId =
            edge.source === node.id ? edge.target : edge.source;
          const other = byId.get(otherId);
          const typeMeta = index.byId.get(edge.type);
          if (!other) return null;
          return (
            <li key={`${edge.source}-${edge.target}-${edge.type}-${i}`}>
              <button
                type="button"
                className="atlas-relation-btn"
                onClick={() => onSelectRelated(otherId)}
              >
                <span
                  className="atlas-filter-swatch"
                  style={{ background: typeMeta?.color ?? "#aaa" }}
                />
                {edgeDisplayLabel(node, edge, other, index)}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default AtlasNodeDrawer;
