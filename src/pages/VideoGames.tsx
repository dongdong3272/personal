import "./SubPage.css";

const VideoGames = () => {
  const currentlyPlaying = [
    {
      title: "Your Current Game",
      platform: "PC/Console",
      status: "Playing",
      description: "Add your currently playing games here!",
    },
  ];

  const favorites = [
    {
      title: "Game Title 1",
      genre: "RPG/Action/etc",
      rating: "⭐⭐⭐⭐⭐",
      description: "Why you love this game...",
    },
    {
      title: "Game Title 2",
      genre: "Strategy/Puzzle/etc",
      rating: "⭐⭐⭐⭐⭐",
      description: "What makes this game special...",
    },
  ];

  return (
    <div className="subpage-container">
      <div className="subpage-header">
        <h1 className="subpage-title">
          <span className="title-icon">🎮</span>
          Gaming Adventures
        </h1>
        <p className="subpage-subtitle">
          Welcome to my gaming world! Here's where pixels meet passion and
          controllers become extensions of my soul.
        </p>
      </div>

      <section className="content-section">
        <h2 className="section-title">Currently Playing</h2>
        <div className="cards-grid">
          {currentlyPlaying.map((game, index) => (
            <div key={index} className="content-card gaming-card">
              <div className="card-header">
                <h3 className="card-title">{game.title}</h3>
                <span className="game-platform">{game.platform}</span>
              </div>
              <div className="card-content">
                <div className="game-status">{game.status}</div>
                <p className="card-description">{game.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section">
        <h2 className="section-title">All-Time Favorites</h2>
        <div className="cards-grid">
          {favorites.map((game, index) => (
            <div key={index} className="content-card gaming-card">
              <div className="card-header">
                <h3 className="card-title">{game.title}</h3>
                <span className="game-genre">{game.genre}</span>
              </div>
              <div className="card-content">
                <div className="game-rating">{game.rating}</div>
                <p className="card-description">{game.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="customize-section">
          <h2 className="section-title">🎯 Make It Yours!</h2>
          <div className="customize-card">
            <p>
              <strong>Ready to personalize this page?</strong> Here are some
              ideas:
            </p>
            <ul className="customize-list">
              <li>Add screenshots or artwork from your favorite games</li>
              <li>Create a "Gaming Setup" section with photos</li>
              <li>Add a "Wish List" for upcoming games</li>
              <li>Include gaming achievements or memorable moments</li>
              <li>Add links to your gaming profiles (Steam, Xbox, etc.)</li>
              <li>Create a "Game Reviews" section with your thoughts</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VideoGames;
