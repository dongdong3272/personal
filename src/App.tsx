import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Gallery from "./pages/Gallery";
import Cinema from "./pages/Cinema";
import Writings from "./pages/Writings";
import WritingDetail from "./pages/WritingDetail";

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
            <Route path="/writings" element={<Writings />} />
            <Route path="/writings/:id" element={<WritingDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
