import { useState, useEffect } from "react";
import { WritingsService } from "../services/writingsService";
import WritingCard from "../components/WritingCard";
import type { Writing } from "../types/writings";
import "./Home.css"; // Reuse existing styles

const Writings = () => {
  const [writings, setWritings] = useState<Writing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const allWritings = WritingsService.getAllWritings();
      setWritings(allWritings);
    } catch (error) {
      console.error("Failed to load writings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="home-page">
        <div className="page-container">
          <div className="loading-message">Loading writings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="page-container">
        <section className="personal-info-section">
          <div className="section-header">
            <h1 className="section-title">My Writings</h1>
            <p className="section-subtitle">
              Personal essays, book reviews, and reflections on life,
              technology, and everything in between
            </p>
          </div>

          {writings.length === 0 ? (
            <div className="no-writings">
              <p>
                No writings found. Add some .pdf files to the
                /src/data/writings/ folder!
              </p>
              <p>Use the format: "Title@YYYY-MM-DD@Tags.pdf"</p>
              <p className="format-example">
                Example: "My Essay@2024-10-26@Personal,Reflection.pdf"
              </p>
            </div>
          ) : (
            <div className="writings-grid">
              {writings.map((writing) => (
                <WritingCard key={writing.id} writing={writing} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Writings;
