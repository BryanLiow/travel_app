"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface User {
  username: string;
  token: string | null;
  expiry: number | null;
  // Add other user-related fields here
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  authDialogOpen: boolean;
  toggleAuthDialog: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_VALIDITY_PERIOD = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const tokenData = localStorage.getItem("token");
    if (tokenData) {
      const { token, expiry } = JSON.parse(tokenData);
      if (Date.now() < expiry) {
        return { username: "", token, expiry };
      }
    }
    return { username: "", token: null, expiry: null };
  });

  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const toggleAuthDialog = () => {
    setAuthDialogOpen(!authDialogOpen);
  };

  const login = (userData: User) => {
    const expiry = Date.now() + TOKEN_VALIDITY_PERIOD;
    const userWithExpiry = { ...userData, expiry };
    setUser(userWithExpiry);
    if (userData.token) {
      localStorage.setItem(
        "token",
        JSON.stringify({ token: userData.token, expiry })
      );
    }
  };

  const logout = () => {
    setUser({ username: "", token: null, expiry: null });
    localStorage.removeItem("token");
    setAuthDialogOpen(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (user && user.expiry && Date.now() > user.expiry) {
        logout();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, authDialogOpen, toggleAuthDialog }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
