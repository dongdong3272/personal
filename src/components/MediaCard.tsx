import React from "react";
import "./MediaCard.css";

export interface MediaCardProps {
  id?: string;
  image: string;
  title: string;
  year?: number | string;
  author?: string; // For books
  director?: string; // For movies/anime
  description?: string;
  reviewLink?: string;
  type?: "book" | "movie" | "anime" | "other";
  rating?: number; // Optional rating out of 5 or 10
  genre?: string;
  onClick?: () => void;
}

const MediaCard: React.FC<MediaCardProps> = ({
  image,
  title,
  year,
  author,
  director,
  description,
  reviewLink,
  type = "other",
  rating,
  genre,
  onClick,
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (reviewLink) {
      window.open(reviewLink, "_blank", "noopener,noreferrer");
    }
  };

  const getCreatorText = () => {
    if (author) return `by ${author}`;
    if (director) return `dir. ${director}`;
    return "";
  };

  const getTypeIcon = () => {
    switch (type) {
      case "book":
        return "📚";
      case "movie":
        return "🎬";
      case "anime":
        return "🎌";
      default:
        return "📖";
    }
  };

  return (
    <div className="media-card" onClick={handleCardClick}>
      <div className="media-card-image-container">
        <img
          src={image}
          alt={title}
          className="media-card-image"
          loading="lazy"
          onError={(e) => {
            // Fallback to a placeholder if image fails to load
            (e.target as HTMLImageElement).src =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiLz4KPHRleHQgeD0iMTAwIiB5PSIxNTAiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC41KSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0Ij5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+";
          }}
        />
        <div className="media-card-overlay">
          <div className="media-card-type">{getTypeIcon()}</div>
          {rating && <div className="media-card-rating">⭐ {rating}</div>}
        </div>
      </div>

      <div className="media-card-content">
        <div className="media-card-header">
          <h3 className="media-card-title">{title}</h3>
          <div className="media-card-meta">
            {year && <span className="media-card-year">({year})</span>}
            {getCreatorText() && (
              <span className="media-card-creator">{getCreatorText()}</span>
            )}
          </div>
          {genre && <span className="media-card-genre">{genre}</span>}
        </div>

        {description && <p className="media-card-description">{description}</p>}

        {reviewLink && (
          <div className="media-card-actions">
            <span className="media-card-review-link">Read My Review →</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaCard;
