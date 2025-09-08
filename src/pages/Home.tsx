import { useState, useEffect } from "react";
import "./Home.css";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const characteristics = [
    {
      label: "Favorite Color",
      value: "Ocean Blue",
      icon: "🌊",
      color: "#3498db",
    },
    { label: "Blood Type", value: "O+", icon: "🩸", color: "#e74c3c" },
    {
      label: "Coffee or Tea",
      value: "Coffee ☕",
      icon: "☕",
      color: "#8b4513",
    },
    {
      label: "Morning Person",
      value: "Night Owl 🦉",
      icon: "🌙",
      color: "#9b59b6",
    },
    {
      label: "Superpower",
      value: "Time Management",
      icon: "⚡",
      color: "#f39c12",
    },
    {
      label: "Spirit Animal",
      value: "Curious Cat",
      icon: "🐱",
      color: "#2ecc71",
    },
  ];

  const funFacts = [
    "I can solve a Rubik's cube in under 2 minutes! 🧩",
    "I've watched The Office series 4 times and still laugh at Jim's pranks 😄",
    "I collect vintage postcards from places I've never been to 📮",
    "I can name all Pokemon from Gen 1 in alphabetical order 🔥",
    "I make the world's best instant ramen (secret ingredient: love) 🍜",
    "I talk to my plants and they seem to like it 🌱",
  ];

  return (
    <div className={`home-container ${isVisible ? "fade-in" : ""}`}>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="profile-photo-container">
            <div className="profile-photo">
              <div className="photo-placeholder">
                <span className="photo-text">Your Photo Here</span>
                <p className="photo-instruction">
                  Replace this with your favorite photo!
                </p>
              </div>
            </div>
            <div className="photo-decoration"></div>
          </div>

          <div className="hero-text">
            <h1 className="hero-title">
              <span className="wave">👋</span> Hey there! I'm{" "}
              <span className="name-highlight">DongDong</span>
            </h1>
            <p className="hero-subtitle">
              Welcome to my little corner of the internet! This is where I share
              my passions, adventures, and the random thoughts that keep me up
              at night.
            </p>
            <div className="hero-description">
              <p>
                I'm a curious soul who loves diving deep into new worlds -
                whether that's through an amazing book, an epic video game, or
                planning my next adventure. When I'm not coding or studying,
                you'll find me exploring coffee shops, binge-watching series, or
                getting lost in a good story.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Characteristics Section */}
      <section className="characteristics-section">
        <h2 className="section-title">
          <span className="title-icon">✨</span>A Little About Me
        </h2>
        <div className="characteristics-grid">
          {characteristics.map((char, index) => (
            <div
              key={char.label}
              className="characteristic-card"
              style={{ "--delay": `${index * 0.1}s` } as React.CSSProperties}
            >
              <div className="char-icon" style={{ color: char.color }}>
                {char.icon}
              </div>
              <div className="char-content">
                <h3 className="char-label">{char.label}</h3>
                <p className="char-value" style={{ color: char.color }}>
                  {char.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fun Facts Section */}
      <section className="fun-facts-section">
        <h2 className="section-title">
          <span className="title-icon">🎉</span>
          Fun Facts About Me
        </h2>
        <div className="fun-facts-container">
          {funFacts.map((fact, index) => (
            <div
              key={index}
              className="fun-fact-card"
              style={{ "--delay": `${index * 0.15}s` } as React.CSSProperties}
            >
              <p className="fun-fact-text">{fact}</p>
            </div>
          ))}
        </div>
        <div className="add-your-facts">
          <p className="instruction-text">
            💡 <strong>Your turn!</strong> Replace these with your own fun facts
            and make this page truly yours!
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Let's Explore Together!</h2>
          <p className="cta-text">
            Check out the different sections to learn more about my interests
            and hobbies. Each page is a window into something I'm passionate
            about!
          </p>
          <div className="cta-buttons">
            <a href="#games" className="cta-button primary">
              🎮 Gaming Adventures
            </a>
            <a href="#books" className="cta-button secondary">
              📚 Book Recommendations
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
