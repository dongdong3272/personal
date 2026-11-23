import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  gameQuizOptions,
  movieQuizOptions,
} from "../config/authQuizOptions";
import "./Unlock.css";

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const GENERIC_ERROR =
  "At least one answer doesn't match. Please try again.";

const Unlock = () => {
  const { isAuthenticated, isReady, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname ?? "/";

  const shuffledMovies = useMemo(() => shuffle(movieQuizOptions), []);
  const shuffledGames = useMemo(() => shuffle(gameQuizOptions), []);

  const [birthday, setBirthday] = useState("");
  const [hometown, setHometown] = useState("");
  const [movieId, setMovieId] = useState("");
  const [gameId, setGameId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isReady && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [from, isAuthenticated, isReady, navigate]);

  if (!isReady) {
    return (
      <div className="unlock-page">
        <div className="unlock-card">
          <p className="unlock-loading">Loading…</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!birthday || !hometown || !movieId || !gameId) {
      setError("Please answer all four questions.");
      return;
    }

    setSubmitting(true);
    try {
      const ok = await login({
        birthday,
        hometown,
        movieOptionId: movieId,
        gameOptionId: gameId,
      });
      if (!ok) {
        setError(GENERIC_ERROR);
        return;
      }
      navigate(from, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="unlock-page">
      <div className="unlock-card">
        <header className="unlock-header">
          <p className="unlock-eyebrow">Friends & familiar faces</p>
          <h1 className="unlock-title">A few questions first</h1>
          <p className="unlock-subtitle">
            This site is personal. Answer all four correctly to enter — we won't
            say which one missed.
          </p>
        </header>

        <form className="unlock-form" onSubmit={onSubmit}>
          <div className="unlock-field">
            <label className="unlock-label" htmlFor="auth-birthday">
              My birthday
            </label>
            <input
              id="auth-birthday"
              className="unlock-input"
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              autoComplete="off"
              required
            />
          </div>

          <div className="unlock-field">
            <label className="unlock-label" htmlFor="auth-hometown">
              My hometown
            </label>
            <input
              id="auth-hometown"
              className="unlock-input"
              type="text"
              value={hometown}
              onChange={(e) => setHometown(e.target.value)}
              autoComplete="off"
              required
            />
          </div>

          <fieldset className="unlock-fieldset">
            <legend className="unlock-label">My favorite movie</legend>
            <div className="unlock-options">
              {shuffledMovies.map((option) => (
                <label
                  key={option.id}
                  className={`unlock-option ${
                    movieId === option.id ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="favorite-movie"
                    value={option.id}
                    checked={movieId === option.id}
                    onChange={() => setMovieId(option.id)}
                    required
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="unlock-fieldset">
            <legend className="unlock-label">My favorite game</legend>
            <div className="unlock-options">
              {shuffledGames.map((option) => (
                <label
                  key={option.id}
                  className={`unlock-option ${
                    gameId === option.id ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="favorite-game"
                    value={option.id}
                    checked={gameId === option.id}
                    onChange={() => setGameId(option.id)}
                    required
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {error && (
            <p className="unlock-error" role="alert">
              {error}
            </p>
          )}

          <button className="unlock-submit" type="submit" disabled={submitting}>
            {submitting ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Unlock;