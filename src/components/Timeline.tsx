import React from "react";
import "./Timeline.css";

export interface TimelineItem {
  id: string;
  period: string;
  stage: string;
  hobbies: string[];
  achievements: string[];
  side: "left" | "right";
}

export interface TimelineProps {
  items: TimelineItem[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div className="timeline-container">
      <div className="timeline-line"></div>
      {items.map((item) => (
        <div key={item.id} className={`timeline-item ${item.side}`}>
          <div className="timeline-dot">
            <div className="timeline-dot-inner"></div>
          </div>
          <div className="timeline-content">
            <div className="timeline-card">
              <div className="timeline-header">
                <h3 className="timeline-period">{item.period}</h3>
                <h4 className="timeline-stage">{item.stage}</h4>
              </div>

              <div className="timeline-section">
                <h5 className="timeline-section-title">🎯 Hobbies</h5>
                <ul className="timeline-list">
                  {item.hobbies.map((hobby, hobbyIndex) => (
                    <li key={hobbyIndex} className="timeline-list-item">
                      {hobby}
                    </li>
                  ))}
                </ul>
              </div>
              {item.achievements.length > 0 && (
                <div className="timeline-section">
                  <h5 className="timeline-section-title">🏆 Achievements</h5>
                  <ul className="timeline-list">
                    {item.achievements.map((achievement, achievementIndex) => (
                      <li key={achievementIndex} className="timeline-list-item">
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
