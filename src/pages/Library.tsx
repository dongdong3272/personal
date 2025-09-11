import MediaCard, { type MediaCardProps } from "../components/MediaCard";
import "../pages/Home.css"; // Reuse the home page styles for background
import booksData from "../data/books.json";

const Library = () => {
  // Sort books by rating in descending order (highest rating first)
  const sortedBooks = (booksData as MediaCardProps[]).sort((a, b) => {
    const ratingA = a.rating || 0;
    const ratingB = b.rating || 0;
    return ratingB - ratingA;
  });

  return (
    <div className="home-page">
      <div className="page-container">
        <section className="personal-info-section">
          <div className="section-header">
            <h1 className="section-title">My Library</h1>
            <p className="section-subtitle">
              My top 15 favorite books that have profoundly influenced my
              perspective and personal growth
            </p>
          </div>

          <div className="media-grid">
            {sortedBooks.map((book) => (
              <MediaCard key={book.id} {...book} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Library;
