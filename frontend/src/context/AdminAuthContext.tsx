import React, { createContext, useContext, useState, useEffect } from "react";
import {
  adminLogin as apiAdminLogin,
  adminLogout as apiAdminLogout,
  getCurrentAdmin,
  setAdminToken,
  getAdminToken,
  Admin,
} from "../lib/adminApi";

interface AdminAuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if admin is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log("[AdminAuthContext] Checking auth on mount...");
      const token = getAdminToken();
      console.log("[AdminAuthContext] Token from storage:", token ? "exists" : "none");
      
      if (!token) {
        console.log("[AdminAuthContext] No token, setting loading to false");
        setIsLoading(false);
        return;
      }

      try {
        console.log("[AdminAuthContext] Fetching current admin...");
        const response = await getCurrentAdmin();
        console.log("[AdminAuthContext] getCurrentAdmin response:", response);
        if (response.success) {
          console.log("[AdminAuthContext] Admin authenticated:", response.admin);
          setAdmin(response.admin);
        }
      } catch (error) {
        console.error("[AdminAuthContext] Auth check failed:", error);
        setAdminToken(null);
      } finally {
        console.log("[AdminAuthContext] Auth check complete, setting loading to false");
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    console.log("[AdminAuthContext] Login attempt for:", email);
    try {
      const response = await apiAdminLogin(email, password);
      console.log("[AdminAuthContext] Login response:", response);
      
      if (response.success) {
        console.log("[AdminAuthContext] Login successful, setting token and admin");
        setAdminToken(response.data.access_token);
        setAdmin(response.data.admin);
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error: any) {
      console.error("[AdminAuthContext] Login error:", error);
      throw new Error(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  };

  const logout = async () => {
    console.log("[AdminAuthContext] Logging out...");
    try {
      await apiAdminLogout();
      console.log("[AdminAuthContext] Logout successful");
    } catch (error) {
      console.error("[AdminAuthContext] Logout error:", error);
    } finally {
      console.log("[AdminAuthContext] Clearing token and admin");
      setAdminToken(null);
      setAdmin(null);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
};
