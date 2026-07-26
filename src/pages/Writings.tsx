import { useState, useEffect } from "react";
import { WritingsService } from "../services/writingsService";
import WritingCard from "../components/WritingCard";
import AtlasCard from "../components/atlas/AtlasCard";
import { getAtlasIndex } from "../services/atlasService";
import type { Writing } from "../types/writings";
import "./Home.css"; // Reuse existing styles

const Writings = () => {
  const [writings, setWritings] = useState<Writing[]>([]);
  const [loading, setLoading] = useState(true);
  const atlasEntries = getAtlasIndex();

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
                No writings found. Add some .md files to the
                /src/data/writings/ folder!
              </p>
              <p>Use the format: "Title@YYYY-MM-DD@Tags.md"</p>
              <p className="format-example">
                Example: "My Essay@2024-10-26@Personal,Reflection.md"
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

        <section className="personal-info-section atlas-section">
          <div className="section-header">
            <h2 className="section-title">Atlas</h2>
            <p className="section-subtitle">
              宏篇巨著人物繁多。Atlas 帮你梳理作品中的人物关系脉络。
         
            </p>
          </div>
          <div className="atlas-grid">
            {atlasEntries.map((entry) => (
              <AtlasCard key={entry.id} entry={entry} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Writings;
