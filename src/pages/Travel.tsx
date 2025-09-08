import "./SubPage.css";

const Travel = () => {
  const recentTrips = [
    {
      destination: "Recent Destination",
      date: "Month Year",
      highlight: "Best memory from this trip",
      photos: "Add photos here!",
    },
  ];

  const dreamDestinations = [
    {
      place: "Dream Destination 1",
      reason: "Why you want to go there",
      activities: "What you'd love to do",
    },
    {
      place: "Dream Destination 2",
      reason: "What draws you to this place",
      activities: "Your planned adventures",
    },
  ];

  const travelTips = [
    "Pack light, but don't forget the essentials",
    "Always have a backup plan (and backup snacks)",
    "The best adventures happen when you get a little lost",
    "Local food is the best food - be brave and try it!",
  ];

  return (
    <div className="subpage-container">
      <div className="subpage-header">
        <h1 className="subpage-title">
          <span className="title-icon">✈️</span>
          Wanderlust Chronicles
        </h1>
        <p className="subpage-subtitle">
          The world is a book, and those who do not travel read only one page.
          Here are the chapters of my journey around this beautiful planet.
        </p>
      </div>

      <section className="content-section">
        <h2 className="section-title">Recent Adventures</h2>
        <div className="cards-grid">
          {recentTrips.map((trip, index) => (
            <div key={index} className="content-card travel-card">
              <div className="card-header">
                <h3 className="card-title">{trip.destination}</h3>
                <span className="travel-date">{trip.date}</span>
              </div>
              <div className="card-content">
                <div className="travel-highlight">
                  <strong>Highlight:</strong> {trip.highlight}
                </div>
                <p className="card-description">{trip.photos}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section">
        <h2 className="section-title">Dream Destinations</h2>
        <div className="cards-grid">
          {dreamDestinations.map((destination, index) => (
            <div key={index} className="content-card travel-card dream-card">
              <div className="card-header">
                <h3 className="card-title">{destination.place}</h3>
                <span className="dream-indicator">✨ Bucket List</span>
              </div>
              <div className="card-content">
                <p className="travel-reason">
                  <strong>Why:</strong> {destination.reason}
                </p>
                <p className="travel-activities">
                  <strong>Plan:</strong> {destination.activities}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section">
        <h2 className="section-title">Travel Wisdom</h2>
        <div className="tips-container">
          {travelTips.map((tip, index) => (
            <div key={index} className="tip-card">
              <span className="tip-number">{index + 1}</span>
              <p className="tip-text">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="travel-stats">
          <h2 className="section-title">Travel Stats</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">0</span>
              <span className="stat-label">Countries Visited</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">0</span>
              <span className="stat-label">Cities Explored</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">0</span>
              <span className="stat-label">Miles Traveled</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">∞</span>
              <span className="stat-label">Memories Made</span>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="customize-section">
          <h2 className="section-title">🗺️ Map Your Journey</h2>
          <div className="customize-card">
            <p>
              <strong>Ideas to make this page your travel diary:</strong>
            </p>
            <ul className="customize-list">
              <li>Add photos from your favorite trips</li>
              <li>Create an interactive map showing places you've been</li>
              <li>Add travel stories and funny mishaps</li>
              <li>Include local foods you've tried and loved</li>
              <li>Share your packing lists and travel hacks</li>
              <li>Add a section for travel quotes that inspire you</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Travel;
