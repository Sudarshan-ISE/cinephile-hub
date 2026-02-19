import React, { createContext, useContext, useState, useCallback } from "react";
import { User, getCurrentUser, login as authLogin, logout as authLogout, register as authRegister } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getCurrentUser);

  const login = useCallback((email: string, password: string) => {
    const result = authLogin(email, password);
    if (result.success && result.user) setUser(result.user);
    return result;
  }, []);

  const register = useCallback((name: string, email: string, password: string) => {
    return authRegister(name, email, password);
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
