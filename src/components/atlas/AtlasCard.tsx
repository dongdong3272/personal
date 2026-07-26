import { Link } from "react-router-dom";
import type { AtlasIndexEntry } from "../../types/atlas";
import "./AtlasCard.css";

type AtlasCardProps = {
  entry: AtlasIndexEntry;
};

const AtlasCard = ({ entry }: AtlasCardProps) => {
  return (
    <Link to={`/writings/atlas/${entry.id}`} className="atlas-card">
      <h3 className="atlas-card-title">{entry.title}</h3>
      <p className="atlas-card-work">{entry.workTitle}</p>
      <p className="atlas-card-subtitle">{entry.subtitle}</p>
      <div className="atlas-card-meta">
        <span>{entry.nodeCount} 人物</span>
        <span className="atlas-card-cta">打开图谱 →</span>
      </div>
    </Link>
  );
};

export default AtlasCard;
