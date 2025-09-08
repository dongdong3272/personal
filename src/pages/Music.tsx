import "./SubPage.css";

const Music = () => {
  const currentlyListening = [
    {
      song: "Current Favorite Song",
      artist: "Artist Name",
      album: "Album Name",
      mood: "Energetic/Chill/Emotional/etc",
      onRepeat: true,
    },
  ];

  const favoriteArtists = [
    {
      name: "Favorite Artist 1",
      genre: "Pop/Rock/Hip-Hop/etc",
      favoriteSong: "Their best song",
      discovered: "How you discovered them",
    },
    {
      name: "Favorite Artist 2",
      genre: "Indie/Electronic/etc",
      favoriteSong: "Your favorite track",
      discovered: "Your discovery story",
    },
  ];

  const playlists = [
    {
      name: "Study Vibes",
      description: "Perfect background music for coding sessions",
      songCount: "25 songs",
    },
    {
      name: "Road Trip Hits",
      description: "Sing-along favorites for long drives",
      songCount: "40 songs",
    },
    {
      name: "Late Night Feels",
      description: "Contemplative tracks for quiet moments",
      songCount: "30 songs",
    },
  ];

  return (
    <div className="subpage-container">
      <div className="subpage-header">
        <h1 className="subpage-title">
          <span className="title-icon">🎵</span>
          Musical Journey
        </h1>
        <p className="subpage-subtitle">
          Music is the soundtrack to my life. These are the melodies, rhythms,
          and voices that move my soul.
        </p>
      </div>

      <section className="content-section">
        <h2 className="section-title">Currently On Repeat</h2>
        <div className="cards-grid">
          {currentlyListening.map((track, index) => (
            <div key={index} className="content-card music-card">
              <div className="card-header">
                <h3 className="card-title">{track.song}</h3>
                <span className="music-artist">by {track.artist}</span>
              </div>
              <div className="card-content">
                <div className="music-meta">
                  <span className="music-album">{track.album}</span>
                  <span className="music-mood">{track.mood}</span>
                  {track.onRepeat && (
                    <span className="on-repeat">🔄 On Repeat</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section">
        <h2 className="section-title">Favorite Artists</h2>
        <div className="cards-grid">
          {favoriteArtists.map((artist, index) => (
            <div key={index} className="content-card music-card">
              <div className="card-header">
                <h3 className="card-title">{artist.name}</h3>
                <span className="music-genre">{artist.genre}</span>
              </div>
              <div className="card-content">
                <p className="favorite-song">
                  <strong>Favorite Track:</strong> {artist.favoriteSong}
                </p>
                <p className="card-description">{artist.discovered}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section">
        <h2 className="section-title">My Playlists</h2>
        <div className="playlists-container">
          {playlists.map((playlist, index) => (
            <div key={index} className="playlist-card">
              <div className="playlist-header">
                <h3 className="playlist-name">{playlist.name}</h3>
                <span className="playlist-count">{playlist.songCount}</span>
              </div>
              <p className="playlist-description">{playlist.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="music-mood-section">
          <h2 className="section-title">Music for Every Mood</h2>
          <div className="mood-grid">
            <div className="mood-item">
              <span className="mood-emoji">☀️</span>
              <span className="mood-label">Happy Vibes</span>
            </div>
            <div className="mood-item">
              <span className="mood-emoji">🌧️</span>
              <span className="mood-label">Rainy Day</span>
            </div>
            <div className="mood-item">
              <span className="mood-emoji">💪</span>
              <span className="mood-label">Workout</span>
            </div>
            <div className="mood-item">
              <span className="mood-emoji">🌙</span>
              <span className="mood-label">Late Night</span>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="customize-section">
          <h2 className="section-title">🎧 Customize Your Sound</h2>
          <div className="customize-card">
            <p>
              <strong>Make this page sing with your personality:</strong>
            </p>
            <ul className="customize-list">
              <li>Add album artwork or concert photos</li>
              <li>Link to your Spotify, Apple Music, or other profiles</li>
              <li>Create a "Concert Memories" section</li>
              <li>Add music-related quotes or lyrics that inspire you</li>
              <li>Include your musical instruments or setup photos</li>
              <li>Create seasonal or yearly "Best Of" lists</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Music;
