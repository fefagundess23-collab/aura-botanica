import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, isAuthorizedAdmin } from '../firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = Boolean(user && isAuthorizedAdmin(user.email));

  const loginWithGoogle = async (): Promise<boolean> => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (isAuthorizedAdmin(result.user.email)) {
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Erro no login Google:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('O login foi cancelado.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        // Ignorar cancelamento repetido
      } else {
        setError('Falha na autenticação com o Google. Tente novamente.');
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setError(null);
    } catch (err) {
      console.error('Erro ao sair:', err);
      setError('Erro ao encerrar sessão.');
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        error,
        loginWithGoogle,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
