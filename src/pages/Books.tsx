import "./SubPage.css";

const Books = () => {
  const currentlyReading = [
    {
      title: "Your Current Book",
      author: "Author Name",
      progress: "Chapter 5 / 20",
      thoughts: "Add your thoughts about what you're reading...",
    },
  ];

  const favorites = [
    {
      title: "Favorite Book 1",
      author: "Author Name",
      genre: "Fiction/Non-fiction/etc",
      rating: "⭐⭐⭐⭐⭐",
      review: "Why this book changed your life...",
    },
    {
      title: "Favorite Book 2",
      author: "Author Name",
      genre: "Mystery/Romance/etc",
      rating: "⭐⭐⭐⭐⭐",
      review: "What made this book unforgettable...",
    },
  ];

  const quotes = [
    {
      text: "Add your favorite quote from a book here...",
      book: "Book Title",
      author: "Author Name",
    },
  ];

  return (
    <div className="subpage-container">
      <div className="subpage-header">
        <h1 className="subpage-title">
          <span className="title-icon">📚</span>
          Literary Journey
        </h1>
        <p className="subpage-subtitle">
          Books are portals to infinite worlds. Here are the stories that have
          shaped my imagination and perspective.
        </p>
      </div>

      <section className="content-section">
        <h2 className="section-title">Currently Reading</h2>
        <div className="cards-grid">
          {currentlyReading.map((book, index) => (
            <div key={index} className="content-card book-card">
              <div className="card-header">
                <h3 className="card-title">{book.title}</h3>
                <span className="book-author">by {book.author}</span>
              </div>
              <div className="card-content">
                <div className="book-progress">{book.progress}</div>
                <p className="card-description">{book.thoughts}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section">
        <h2 className="section-title">Favorite Reads</h2>
        <div className="cards-grid">
          {favorites.map((book, index) => (
            <div key={index} className="content-card book-card">
              <div className="card-header">
                <h3 className="card-title">{book.title}</h3>
                <span className="book-author">by {book.author}</span>
              </div>
              <div className="card-content">
                <div className="book-meta">
                  <span className="book-genre">{book.genre}</span>
                  <span className="book-rating">{book.rating}</span>
                </div>
                <p className="card-description">{book.review}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section">
        <h2 className="section-title">Favorite Quotes</h2>
        <div className="quotes-container">
          {quotes.map((quote, index) => (
            <div key={index} className="quote-card">
              <blockquote className="quote-text">"{quote.text}"</blockquote>
              <cite className="quote-source">
                — {quote.book} by {quote.author}
              </cite>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="customize-section">
          <h2 className="section-title">📖 Personalize Your Library</h2>
          <div className="customize-card">
            <p>
              <strong>Make this page uniquely yours:</strong>
            </p>
            <ul className="customize-list">
              <li>Add book covers or photos of your bookshelf</li>
              <li>Create reading goals and track your progress</li>
              <li>Add a "To Be Read" pile section</li>
              <li>Include book club discussions or recommendations</li>
              <li>Share your favorite reading spots with photos</li>
              <li>Add links to your Goodreads or other reading profiles</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Books;
