import { createContext, useState, useContext, ReactNode } from "react";
import { setAuthToken } from "../lib/api";

interface AuthContextType {
  accessToken: string | null;
  email: string | null;
  isVerifiedAlumni: boolean | null;
  setAuth: (
    token: string | null,
    email: string | null,
    isVerified: boolean | null
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isVerifiedAlumni, setIsVerifiedAlumni] = useState<boolean | null>(
    null
  );

  const setAuth = (
    token: string | null,
    email: string | null,
    isVerified: boolean | null
  ) => {
    setAccessToken(token);
    setEmail(email);
    setIsVerifiedAlumni(isVerified);
    setAuthToken(token);
  };

  const logout = () => {
    setAccessToken(null);
    setEmail(null);
    setIsVerifiedAlumni(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, email, isVerifiedAlumni, setAuth, logout }}
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
