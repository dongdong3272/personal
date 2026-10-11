import MediaCard, { type MediaCardProps } from "../components/MediaCard";
import "../pages/Home.css";
import gamesData from "../data/games.json";

const Games = () => {
  const sortedGames = [...(gamesData as MediaCardProps[])].sort((a, b) => {
    const ratingA = a.rating || 0;
    const ratingB = b.rating || 0;
    return ratingB - ratingA;
  });

  return (
    <div className="home-page">
      <div className="page-container">
        <section className="personal-info-section">
          <div className="section-header">
            <h1 className="section-title">My Games</h1>
            <p className="section-subtitle">
              My top 10 favorite games that I keep returning to
            </p>
          </div>

          <div className="media-grid">
            {sortedGames.slice(0, 10).map((game) => (
              <MediaCard key={game.id} {...game} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Games;
