"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  setLoginStatus: (status: boolean) => void; // ⬅️ Tambahkan ini
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const login = (token: string, user?: any) => {
    localStorage.setItem("token", token);
    if (user) localStorage.setItem("user", JSON.stringify(user));
    setIsLoggedIn(true);
  };  

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Tambahan (opsional)
    setIsLoggedIn(false);
  };

  const setLoginStatus = (status: boolean) => {
    setIsLoggedIn(status);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, setLoginStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
