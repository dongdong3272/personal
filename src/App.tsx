import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Gallery from "./pages/Gallery";
import Cinema from "./pages/Cinema";

function App() {
  return (
    <Router basename="/personal">
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/cinema" element={<Cinema />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
