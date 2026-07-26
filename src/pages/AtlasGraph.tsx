import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AtlasGraphView from "../components/atlas/AtlasGraphView";
import AtlasNodeDrawer from "../components/atlas/AtlasNodeDrawer";
import { getAtlasGraph } from "../services/atlasService";
import type { AtlasNode } from "../types/atlas";
import "./Home.css";
import "./AtlasGraph.css";

const AtlasGraph = () => {
  const { id = "" } = useParams<{ id: string }>();
  const graph = useMemo(() => getAtlasGraph(id), [id]);

  const [selectedNode, setSelectedNode] = useState<AtlasNode | null>(null);
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedNode(null);
    setFocusNodeId(null);
  }, [graph]);

  const handleSelectRelated = useCallback(
    (nodeId: string) => {
      if (!graph) return;
      const node = graph.nodes.find((n) => n.id === nodeId) ?? null;
      setSelectedNode(node);
      setFocusNodeId(nodeId);
    },
    [graph]
  );

  if (!graph) {
    return (
      <div className="home-page atlas-page">
        <div className="atlas-page-inner atlas-missing">
          <h1>Graph not found</h1>
          <p>No Atlas data for id “{id}”.</p>
          <Link to="/writings" className="atlas-back-link">
            ← Back to Writings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page atlas-page">
      <div className="atlas-page-inner">
        <header className="atlas-toolbar">
          <div className="atlas-toolbar-left">
            <Link to="/writings" className="atlas-back-link">
              ← Writings
            </Link>
            <div className="atlas-toolbar-titles">
              <h1 className="atlas-page-title">{graph.title}</h1>
              <p className="atlas-page-subtitle">{graph.workTitle}</p>
            </div>
          </div>
        </header>

        {graph.description && (
          <p className="atlas-description">{graph.description}</p>
        )}

        <div className="atlas-workspace">
          <div className="atlas-canvas-wrap">
            <AtlasGraphView
              graph={graph}
              selectedNodeId={selectedNode?.id ?? null}
              focusNodeId={focusNodeId}
              onSelectNode={setSelectedNode}
              onFocusConsumed={() => setFocusNodeId(null)}
            />
            <p className="atlas-hint">
              Click a person for details · Scroll to zoom for more
            </p>
          </div>

          <aside
            className={`atlas-drawer-host${selectedNode ? " is-open" : ""}`}
            aria-hidden={!selectedNode}
          >
            {selectedNode && (
              <AtlasNodeDrawer
                graph={graph}
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
                onSelectRelated={handleSelectRelated}
              />
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AtlasGraph;
