"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface User {
  username: string;
  token: string | null;
  // Add other user-related fields here
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize user from session storage when the component mounts
    const token = sessionStorage.getItem("token");
    return token ? { username: "", token } : { username: "", token: null };
  });

  const login = (userData: User) => {
    setUser(userData);
    if (userData.token !== null) {
      sessionStorage.setItem("token", userData.token);
    }
  };

  const logout = () => {
    setUser({
      username: "",
      token: null,
    });
    sessionStorage.removeItem("token"); // Remove the token from session storage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
