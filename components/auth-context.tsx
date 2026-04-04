"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isLoggedIn: boolean;
  loading: boolean; // ⬅️ ADD THIS
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setLoginStatus: (status: boolean) => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // ⬅️ NEW
  const router = useRouter();

  // Cek login saat mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await fetch("/api/me", {
          credentials: "include", // ✅ kirim cookie
        });
        setIsLoggedIn(res.ok);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setLoading(false); // ⬅️ NEW
      }
    };
    checkLoginStatus();
  }, []);
  

  // Login menggunakan email + password → token diset di server
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        setIsLoggedIn(true);
        return true;
      } else {
        const data = await res.json();
        console.error("Login failed:", data.error);
        return false;
      }
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  // Logout: panggil /api/logout untuk hapus cookie
  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setIsLoggedIn(false);
    router.push("/");
  };

  const setLoginStatus = (status: boolean) => {
    setIsLoggedIn(status);
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      login,
      logout,
      setLoginStatus,
      loading, // ⬅️ ADD THIS
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
