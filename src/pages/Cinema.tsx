import MediaCard, { type MediaCardProps } from "../components/MediaCard";
import "../pages/Home.css"; // Reuse the home page styles for background
import thrillerMoviesData from "../data/thrillerMovies.json";
import otherMoviesData from "../data/otherMovies.json";
import animesData from "../data/animes.json";

const Cinema = () => {
  // Sort by rating in descending order (highest first)
  const sortByRating = (items: MediaCardProps[]) => {
    return [...items].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  };

  const sortedThrillerMovies = sortByRating(
    thrillerMoviesData as MediaCardProps[]
  );
  const sortedOtherMovies = sortByRating(otherMoviesData as MediaCardProps[]);
  const sortedAnimes = sortByRating(animesData as MediaCardProps[]);

  return (
    <div className="home-page">
      <div className="page-container">
        <section className="personal-info-section">
          <div className="section-header">
            <h1 className="section-title">My Cinema</h1>
            <p className="section-subtitle">
              Films and anime that have captivated my imagination and left
              lasting impressions
            </p>
          </div>

          {/* Top 10 Thriller & Suspense Movies */}
          <div className="subsection">
            <h2 className="subsection-title">
              My Top 15 Thriller & Suspense Movies
            </h2>
            <div className="media-grid">
              {sortedThrillerMovies.map((movie) => (
                <MediaCard key={movie.id} {...movie} />
              ))}
              {sortedThrillerMovies.length === 0 && (
                <p className="empty-section">
                  No thriller movies added yet. Add some to your collection!
                </p>
              )}
            </div>
          </div>

          {/* Top 10 Other Movies */}
          <div className="subsection">
            <h2 className="subsection-title">
              My Top 10 Movies (Other Genres)
            </h2>
            <div className="media-grid">
              {sortedOtherMovies.slice(0, 10).map((movie) => (
                <MediaCard key={movie.id} {...movie} />
              ))}
              {sortedOtherMovies.length === 0 && (
                <p className="empty-section">
                  No other movies added yet. Add some to your collection!
                </p>
              )}
            </div>
          </div>

          {/* Top 10 Anime */}
          <div className="subsection">
            <h2 className="subsection-title">My Top 10 Anime</h2>
            <div className="media-grid">
              {sortedAnimes.slice(0, 10).map((anime) => (
                <MediaCard key={anime.id} {...anime} />
              ))}
              {sortedAnimes.length === 0 && (
                <p className="empty-section">
                  No anime added yet. Add some to your collection!
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Cinema;
