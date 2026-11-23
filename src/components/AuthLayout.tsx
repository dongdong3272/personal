import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import { useAuth } from "../auth/AuthContext";

const AuthLayout = () => {
  const { isAuthenticated, isReady } = useAuth();
  const location = useLocation();

  if (!isReady) {
    return (
      <div className="auth-loading" aria-live="polite">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/unlock" replace state={{ from: location }} />;
  }

  return (
    <>
      <Navigation />
      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
};

export default AuthLayout;