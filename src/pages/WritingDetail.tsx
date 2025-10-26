import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { WritingsService } from "../services/writingsService";
import PDFViewer from "../components/PDFViewer";
import type { Writing } from "../types/writings";
import { formatDate } from "../utils/dateUtils";
import "./WritingDetail.css";

const WritingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [writing, setWriting] = useState<Writing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      try {
        const foundWriting = WritingsService.getWritingById(id);
        setWriting(foundWriting);
      } catch (error) {
        console.error("Failed to load writing:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  if (loading) {
    return (
      <div className="writing-detail-container">
        <div className="loading-message">Loading...</div>
      </div>
    );
  }

  if (!writing) {
    return (
      <div className="writing-detail-container">
        <div className="writing-not-found">
          <h2>Writing not found</h2>
          <p>The writing you're looking for doesn't exist or has been moved.</p>
          <Link to="/writings" className="back-link">
            ← Back to Writings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="writing-detail-container">
      <div className="writing-detail">
        <div className="writing-header">
          <Link to="/writings" className="back-link">
            ← Back to Writings
          </Link>
          <h1 className="writing-detail-title">{writing.title}</h1>
          <p className="writing-detail-date">{formatDate(writing.date)}</p>
        </div>

        <PDFViewer filePath={writing.filePath} title={writing.title} />
      </div>
    </div>
  );
};

export default WritingDetail;
