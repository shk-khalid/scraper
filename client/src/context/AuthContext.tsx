import React, {
  createContext,
  useContext,
  useCallback,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setUser,
  logout as logoutAction,
} from '@/store/slices/authSlice';
import { RootState } from '@/store';
import { useIdleTimer } from '@/hooks/useIdleTimer';
import { useNavigate } from 'react-router-dom';
import {
  signIn as apiSignIn,
  register as apiRegister,
  requestPasswordReset,
  signOut as apiSignOut,
} from '@/services/authService';

interface AuthContextType {
  userEmail: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as any);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userEmail = useSelector((s: RootState) => s.auth.userEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useIdleTimer();

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const { message, user_email, error: err } = await apiSignIn(email, password);
    if (err) {
      setError(message);
      setLoading(false);
      throw new Error(message);
    }
    dispatch(setUser({ email: user_email }));
    setLoading(false);
  }, [dispatch]);

  const registerFn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const { message, error: err } = await apiRegister(email, password);
    setLoading(false);
    if (err) {
      setError(message);
      throw new Error(message);
    }
    // no immediate navigation—component handles it
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    const { message, error: err } = await requestPasswordReset(email);
    setLoading(false);
    if (err) {
      setError(message);
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    await apiSignOut();
    dispatch(logoutAction());
    navigate('/login', { replace: true });
    setLoading(false);
  }, [dispatch, navigate]);

  return (
    <AuthContext.Provider
      value={{
        userEmail,
        loading,
        error,
        isAuthenticated: Boolean(userEmail),
        login,
        register: registerFn,
        forgotPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
