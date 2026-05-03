"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { fetcher } from "@/lib/fetcher";
import { API_ENDPOINTS } from "@/lib/constants";

interface User {
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      // Hanya set loading true jika dipanggil secara manual (setelah mount)
      // Karena nilai awal sudah true
      const response = await fetcher<{ user: User }>(API_ENDPOINTS.AUTH_ME);
      if (response.success && response.data) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((userData: User) => {
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetcher(API_ENDPOINTS.AUTH_LOGOUT, { method: "POST" });
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed", error);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    checkAuth
  }), [user, loading, login, logout, checkAuth]);

  useEffect(() => {
    // Jalankan checkAuth di microtask berikutnya untuk menghindari
    // peringatan "cascading renders" di React 19
    Promise.resolve().then(() => {
      checkAuth();
    });
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
