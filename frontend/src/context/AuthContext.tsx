
import { createContext, useState, useContext, ReactNode } from 'react';
import { setAuthToken } from '../lib/api';

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const setAuthTokenAndState = (token: string | null) => {
    setAccessToken(token);
    setAuthToken(token);
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken: setAuthTokenAndState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
