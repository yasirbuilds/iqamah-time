import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from 'react';
import { toast } from "sonner";
import Cookies from "js-cookie";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (googleToken: string) => Promise<boolean>;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from cookies
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedToken = Cookies.get("token");
        const savedUser = Cookies.get("user");

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear invalid data
        Cookies.remove("token");
        Cookies.remove("user");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (googleToken: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await fetch("https://iqamah-time-production.up.railway.app/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: googleToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.token);

        // Store in cookies
        Cookies.set("token", data.token, { expires: 7 }); // 7 days
        Cookies.set("user", JSON.stringify(data.user), { expires: 7 });

        toast.success(`Welcome ${data.user.name}!`);

        return true;
      } else {
        toast.error(data.message || "Sign-in failed. Please try again.");
        return false;
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      toast.error("Network error. Please check your connection and try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    Cookies.remove("token");
    Cookies.remove("user");

    // Sign out from Google
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }

    toast.success("Signed out successfully. See you soon!");
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    signIn,
    signOut,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Global declaration for Google Sign-In API
declare global {
  interface Window {
    google: any;
  }
}
