import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/library", label: "Library", icon: "📚" },
    { path: "/cinema", label: "Cinema", icon: "🎬" },
    { path: "/gallery", label: "Gallery", icon: "📸" },
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-name">dongdong</div>
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
