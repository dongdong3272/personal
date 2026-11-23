import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import AuthLayout from "./components/AuthLayout";
import Home from "./pages/Home";
import Library from "./pages/Library";
import AtlasGraph from "./pages/AtlasGraph";
import Gallery from "./pages/Gallery";
import Cinema from "./pages/Cinema";
import Games from "./pages/Games";
import Writings from "./pages/Writings";
import WritingDetail from "./pages/WritingDetail";
import Unlock from "./pages/Unlock";

function App() {
  return (
    <AuthProvider>
      <Router basename="/personal">
        <div className="app">
          <Routes>
            <Route path="/unlock" element={<Unlock />} />
            <Route element={<AuthLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/library" element={<Library />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/cinema" element={<Cinema />} />
              <Route path="/games" element={<Games />} />
              <Route path="/writings" element={<Writings />} />
              <Route path="/writings/atlas/:id" element={<AtlasGraph />} />
              <Route path="/writings/:id" element={<WritingDetail />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;