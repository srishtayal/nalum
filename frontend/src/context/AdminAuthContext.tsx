import React, { createContext, useContext, useState, useEffect } from "react";
import {
  adminLogin as apiAdminLogin,
  adminLogout as apiAdminLogout,
  setAdminToken,
  Admin,
} from "../lib/adminApi";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";

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

  // Silent refresh on app load to restore session (similar to main AuthContext)
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        const { access_token, email, user } = response.data.data;
        
        // Check if the user is an admin
        if (user?.role === 'admin') {
          setAdminToken(access_token);
          setAdmin({
            id: user._id || user.id,
            email: email,
            name: user.name,
            role: user.role,
          });
          console.log('[AdminAuthContext] Admin session restored successfully');
        } else {
          console.log('[AdminAuthContext] User is not an admin');
        }
      } catch (error) {
        // No valid refresh token or user is not admin - stay logged out
        console.log('[AdminAuthContext] No active admin session to restore');
        setAdminToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Only attempt restore if we don't already have admin data
    if (!admin) {
      restoreSession();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

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
    } catch (error: unknown) {
      console.error("[AdminAuthContext] Login error:", error);
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : error instanceof Error 
        ? error.message 
        : "Login failed";
      throw new Error(errorMessage || "Login failed");
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

// Default export for compatibility
export default AdminAuthProvider;
