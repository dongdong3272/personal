import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import VideoGames from "./pages/VideoGames";
import Books from "./pages/Books";
import Movies from "./pages/Movies";
import Music from "./pages/Music";
import Travel from "./pages/Travel";
import "./App.css";

function App() {
  return (
    <Router basename="/personal">
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<VideoGames />} />
            <Route path="/books" element={<Books />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/music" element={<Music />} />
            <Route path="/travel" element={<Travel />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
