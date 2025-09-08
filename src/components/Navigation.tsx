import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/games", label: "Games", icon: "🎮" },
    { path: "/books", label: "Books", icon: "📚" },
    { path: "/movies", label: "Movies", icon: "🎬" },
    { path: "/music", label: "Music", icon: "🎵" },
    { path: "/travel", label: "Travel", icon: "✈️" },
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-text">DD</span>
          <span className="logo-subtitle">Personal</span>
        </Link>

        <ul className="nav-menu">
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
