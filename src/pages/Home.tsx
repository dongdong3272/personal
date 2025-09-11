import heroImage from "../assets/personal_photos/index.jpg";
import YearlyGoals, { type YearlyGoalItem } from "../components/YearlyGoals";
import InfoCard, { type InfoCardProps } from "../components/InfoCard";
import Timeline, { type TimelineItem } from "../components/Timeline";

import infoCardsData from "../data/infoCards.json";
import timelineData from "../data/timeline.json";
import yearlyGoalsData from "../data/yearlyGoals.json";

import "./Home.css";

const Home = () => {
  const typedTimelineData: TimelineItem[] = timelineData as TimelineItem[];
  const typedInfoCardsData: InfoCardProps[] = infoCardsData as InfoCardProps[];
  const typedYearlyGoalsData: YearlyGoalItem[] =
    yearlyGoalsData as YearlyGoalItem[];

  return (
    <div className="home-page">
      {/* Hero Section with Full-Width Photo */}
      <section className="hero-section">
        <div className="hero-image-container">
          <img src={heroImage} alt="dongdong" className="hero-image" />
          <div className="hero-overlay">
            <div className="hero-content">
              <h1 className="hero-title">Stay Hungry, Stay Foolish</h1>
              <p className="hero-subtitle">
                With only 30,000 days to live, why not experience it all — the
                joy and the pain, the familiar and the unknown?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Info Section */}
      <section className="personal-info-section">
        <div className="page-container">
          <div className="section-header">
            <h2 className="section-title">My Building Blocks</h2>
          </div>

          <div className="info-grid">
            {/* Personal Details Cards */}
            {typedInfoCardsData.map((card) => (
              <InfoCard
                key={card.id}
                icon={card.icon}
                title={card.title}
                value={card.value}
                description={card.description}
                variant={card.variant}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section - Hobby Evolution */}
      <section className="timeline-section">
        <div className="page-container">
          <div className="section-header">
            <h2 className="section-title">Journey Through Time</h2>
            <p className="section-subtitle">
              A chronicle of passions, growth, and discoveries across different
              chapters of life
            </p>
          </div>
          <Timeline items={typedTimelineData} />
        </div>
      </section>

      {/* 2025 Yearly Goal Section */}
      <section className="yearly-goal-section">
        <div className="page-container">
          <div className="section-header">
            <h2 className="section-title">2025 Vision</h2>
            <p className="section-subtitle">
              The destination that guides every step of this journey
            </p>
          </div>

          <YearlyGoals goals={typedYearlyGoalsData} />
        </div>
      </section>
    </div>
  );
};

export default Home;
