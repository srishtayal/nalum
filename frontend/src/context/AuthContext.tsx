import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { setAuthToken } from "../lib/api";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  email_verified: boolean;
  profileCompleted: boolean;
  verified_alumni: boolean;
}

interface AuthContextType {
  accessToken: string | null;
  email: string | null;
  user: User | null;
  isVerifiedAlumni: boolean | null;
  isRestoringSession: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuth: (
    token: string | null,
    email: string | null,
    isVerified: boolean | null,
    user?: User | null
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isVerifiedAlumni, setIsVerifiedAlumni] = useState<boolean | null>(
    null
  );
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  // Computed values
  const isAuthenticated = !!accessToken && !!email;
  const isAdmin = user?.role === 'admin';

  // Silent refresh on app load to restore session
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const { access_token, email: userEmail, user: userData } = response.data.data;
        const verified_alumni = userData?.verified_alumni || false;
        
        setAccessToken(access_token);
        setEmail(userEmail);
        setUser(userData);
        setIsVerifiedAlumni(verified_alumni);
        setAuthToken(access_token);
        
        console.log('Session restored successfully:', { role: userData?.role });
      } catch (error) {
        // No valid refresh token or it's expired - user stays logged out
        console.log('No active session to restore');
      } finally {
        setIsRestoringSession(false);
      }
    };

    // Only attempt restore if we don't already have a token
    if (!accessToken) {
      restoreSession();
    } else {
      setIsRestoringSession(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const setAuth = (
    token: string | null,
    email: string | null,
    isVerified: boolean | null,
    userData: User | null = null
  ) => {
    setAccessToken(token);
    setEmail(email);
    setUser(userData);
    setIsVerifiedAlumni(isVerified);
    setAuthToken(token);
  };

  const logout = async () => {
    try {
      // Call logout endpoint to clear refresh token cookie on backend
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if backend call fails
    } finally {
      // Clear local auth state
      setAccessToken(null);
      setEmail(null);
      setUser(null);
      setIsVerifiedAlumni(null);
      setAuthToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        accessToken, 
        email, 
        user, 
        isVerifiedAlumni, 
        isRestoringSession, 
        isAuthenticated,
        isAdmin,
        setAuth, 
        logout 
      }}
    >
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
