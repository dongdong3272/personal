import { useNavigate } from "react-router-dom";
import type { Writing } from "../types/writings";
import { formatDate } from "../utils/dateUtils";
import "./WritingCard.css";

interface WritingCardProps {
  writing: Writing;
}

const WritingCard: React.FC<WritingCardProps> = ({ writing }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/writings/${writing.id}`);
  };

  return (
    <div className="writing-card" onClick={handleClick}>
      <div className="writing-card-content">
        <div className="writing-left">
          <div className="writing-icon">📝</div>
          <h3 className="writing-title">{writing.title}</h3>
        </div>

        <div className="writing-center">
          <div className="writing-tags">
            {writing.tags.map((tag, index) => (
              <span key={index} className="writing-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="writing-right">
          <p className="writing-date">{formatDate(writing.date)}</p>
          <div className="writing-read-button">
            <span>Read →</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingCard;
