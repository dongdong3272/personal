import React from "react";
import "./InfoCard.css";

export interface InfoCardProps {
  id?: string;
  icon: string;
  title: string;
  value: string;
  description: string;
  variant?: "primary" | "secondary" | "accent";
}

const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  title,
  value,
  description,
  variant = "accent",
}) => {
  return (
    <div className={`info-card ${variant}`}>
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-value">{value}</p>
        <p className="card-description">{description}</p>
      </div>
    </div>
  );
};

export default InfoCard;
