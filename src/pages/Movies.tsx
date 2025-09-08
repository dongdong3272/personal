import "./SubPage.css";

const Movies = () => {
  const recentWatches = [
    {
      title: "Recent Movie/Show",
      type: "Movie/Series",
      rating: "⭐⭐⭐⭐⭐",
      thoughts: "Your thoughts about this recent watch...",
    },
  ];

  const allTimeFavorites = [
    {
      title: "Favorite Movie 1",
      director: "Director Name",
      year: "2023",
      genre: "Drama/Action/Comedy/etc",
      rating: "⭐⭐⭐⭐⭐",
      review: "Why this movie means so much to you...",
    },
    {
      title: "Favorite Series 1",
      creator: "Creator Name",
      year: "2022",
      genre: "Thriller/Romance/etc",
      rating: "⭐⭐⭐⭐⭐",
      review: "What made this series binge-worthy...",
    },
  ];

  const watchlist = [
    "Movie/Show on your watchlist",
    "Another upcoming release",
    "Classic you haven't seen yet",
  ];

  return (
    <div className="subpage-container">
      <div className="subpage-header">
        <h1 className="subpage-title">
          <span className="title-icon">🎬</span>
          Cinema & Series
        </h1>
        <p className="subpage-subtitle">
          From blockbusters to indie gems, from binge-worthy series to timeless
          classics. Here's my journey through the world of moving pictures.
        </p>
      </div>

      <section className="content-section">
        <h2 className="section-title">Recently Watched</h2>
        <div className="cards-grid">
          {recentWatches.map((item, index) => (
            <div key={index} className="content-card movie-card">
              <div className="card-header">
                <h3 className="card-title">{item.title}</h3>
                <span className="movie-type">{item.type}</span>
              </div>
              <div className="card-content">
                <div className="movie-rating">{item.rating}</div>
                <p className="card-description">{item.thoughts}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section">
        <h2 className="section-title">All-Time Favorites</h2>
        <div className="cards-grid">
          {allTimeFavorites.map((item, index) => (
            <div key={index} className="content-card movie-card">
              <div className="card-header">
                <h3 className="card-title">{item.title}</h3>
                <span className="movie-creator">
                  by {item.director || item.creator} ({item.year})
                </span>
              </div>
              <div className="card-content">
                <div className="movie-meta">
                  <span className="movie-genre">{item.genre}</span>
                  <span className="movie-rating">{item.rating}</span>
                </div>
                <p className="card-description">{item.review}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section">
        <h2 className="section-title">Watchlist</h2>
        <div className="watchlist-container">
          {watchlist.map((item, index) => (
            <div key={index} className="watchlist-item">
              <span className="watchlist-icon">🍿</span>
              <span className="watchlist-title">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="customize-section">
          <h2 className="section-title">🎭 Make It Your Own</h2>
          <div className="customize-card">
            <p>
              <strong>Ideas to personalize this page:</strong>
            </p>
            <ul className="customize-list">
              <li>Add movie posters or screenshots from favorite scenes</li>
              <li>Create a "Movie Night Setup" section with photos</li>
              <li>Add your favorite movie quotes or memorable dialogues</li>
              <li>Include links to your Letterboxd, IMDb, or other profiles</li>
              <li>
                Create themed lists (Best Cinematography, Comfort Movies, etc.)
              </li>
              <li>Add a section about your favorite actors/directors</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Movies;
