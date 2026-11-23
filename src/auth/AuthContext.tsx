import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { verifyAllAnswers } from "./crypto";
import { clearAuth, isAuthenticated, writeAuth } from "./authStorage";

type AuthContextValue = {
  isAuthenticated: boolean;
  isReady: boolean;
  login: (input: {
    birthday: string;
    hometown: string;
    movieOptionId: string;
    gameOptionId: string;
  }) => Promise<boolean>;
  logout: () => void;
  refresh: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const refresh = useCallback(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  useEffect(() => {
    refresh();
    setIsReady(true);
  }, [refresh]);

  const login = useCallback(
    async (input: {
      birthday: string;
      hometown: string;
      movieOptionId: string;
      gameOptionId: string;
    }) => {
      const ok = await verifyAllAnswers(input);
      if (!ok) {
        return false;
      }
      writeAuth();
      setAuthenticated(true);
      return true;
    },
    [],
  );

  const logout = useCallback(() => {
    clearAuth();
    setAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: authenticated,
      isReady,
      login,
      logout,
      refresh,
    }),
    [authenticated, isReady, login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}