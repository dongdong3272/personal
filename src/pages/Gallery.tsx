import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import galleryData from "../data/gallery.json";
import "./Home.css";
import "./Gallery.css";

type Photo = {
  file: string;
  width: number;
  height: number;
};

const photos = galleryData as Photo[];

const TILTS = [-1.6, 1.2, -0.7, 1.8, -1.2, 0.8, 1.5, -1.8, 0.6, -1.4, 1.1];

const baseUrl = import.meta.env.BASE_URL;

function photoUrl(kind: "wall" | "view", file: string) {
  return `${baseUrl}gallery/${kind}/${file}`;
}

const Gallery = () => {
  const [active, setActive] = useState<number | null>(null);
  const [sharp, setSharp] = useState(false);
  const count = photos.length;

  const showPrevious = useCallback(() => {
    setActive((current) =>
      current === null ? current : (current - 1 + count) % count,
    );
  }, [count]);

  const showNext = useCallback(() => {
    setActive((current) =>
      current === null ? current : (current + 1) % count,
    );
  }, [count]);

  useEffect(() => {
    if (active === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrevious();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active, showNext, showPrevious]);

  const current = active === null ? null : photos[active];

  useEffect(() => {
    if (!current) return;

    let cancelled = false;
    setSharp(false);
    const full = new Image();
    full.onload = () => {
      if (!cancelled) setSharp(true);
    };
    full.src = photoUrl("view", current.file);
    return () => {
      cancelled = true;
    };
  }, [current]);

  return (
    <div className="home-page">
      <div className="gallery-page">
        <div className="gallery-wall">
          {photos.map((photo, index) => (
            <button
              key={photo.file}
              type="button"
              className="gallery-print"
              style={
                { "--tilt": `${TILTS[index % TILTS.length]}deg` } as CSSProperties
              }
              onClick={() => setActive(index)}
              aria-label="View photograph"
            >
              <img
                src={photoUrl("wall", photo.file)}
                alt=""
                width={photo.width}
                height={photo.height}
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>

      {current &&
        createPortal(
          <div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Photograph"
            onClick={() => setActive(null)}
          >
            <button
              type="button"
              className="lightbox-nav lightbox-nav-prev"
              aria-label="Previous photograph"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
            >
              ‹
            </button>
            <img
              className="lightbox-photo"
              src={photoUrl(sharp ? "view" : "wall", current.file)}
              alt=""
              width={current.width}
              height={current.height}
              onClick={(event) => event.stopPropagation()}
            />
            <button
              type="button"
              className="lightbox-nav lightbox-nav-next"
              aria-label="Next photograph"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
            >
              ›
            </button>
          </div>,
          document.body,
        )}
      </div>
    </div>
  );
};

export default Gallery;
