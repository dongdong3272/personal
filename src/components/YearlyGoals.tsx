import React from "react";
import "./YearlyGoals.css";

export interface YearlyGoalItem {
  id: string;
  number: string;
  title: string;
  description: string;
}

interface YearlyGoalsProps {
  goals: YearlyGoalItem[];
  year?: string;
  motto?: string;
}

const YearlyGoals: React.FC<YearlyGoalsProps> = ({
  goals,
  year = "2025",
  motto = "Progress over Perfection",
}) => {
  return (
    <div className="goals-container">
      <div className="goals-card">
        <div className="goals-header">
          <div className="goal-icon">🎯</div>
          <h3 className="goals-title">My {year} Yearly Goals</h3>
        </div>

        <div className="goals-list">
          {goals.map((goal) => (
            <div key={goal.id} className="goal-item">
              <div className="goal-number">{goal.number}</div>
              <div className="goal-content">
                <h4 className="goal-item-title">{goal.title}</h4>
                <p className="goal-item-text">{goal.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="goal-accent">
          <span className="goal-year">{year}</span>
          <div className="goal-divider"></div>
          <span className="goal-motto">{motto}</span>
        </div>
      </div>
    </div>
  );
};

export default YearlyGoals;
