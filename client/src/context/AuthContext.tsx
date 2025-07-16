import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  setUser,
  setAccessToken,
  logout as logoutAction,
} from '@/store/slices/authSlice';
import { RootState } from '@/store';
import { useIdleTimer } from '@/hooks/useIdleTimer';
import { useNavigate } from 'react-router-dom';
import { signIn as apiSignIn, signOut as apiSignOut } from '@/services/authService';

interface AuthUser {
  id: string;
  email: string;
  shopUrl: string;
  active: boolean;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useIdleTimer();

  // Wait for PersistGate / rehydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Attach token to axios
  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [accessToken]);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiSignIn(email, password);
        const json = response.data as {
          success: boolean;
          token: string;
          details: {
            id: string;
            email: string;
            shop_url: string;
            active: boolean;
          };
          role: string;
          message: string;
        };

        if (!json.success) {
          throw new Error(json.message || 'Login failed');
        }

        dispatch(
          setUser({
            id: json.details.id,
            email: json.details.email,
            shopUrl: json.details.shop_url,
            active: json.details.active,
            role: json.role,
          })
        );
        dispatch(setAccessToken(json.token));

        // 💡 No navigate here — let the component handle it
      } catch (err: any) {
        console.error('Login error in context:', err);
        setError(err);
        throw err; // so caller’s catch block runs
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await apiSignOut();
    } catch (err) {
      console.error('Sign-out error:', err);
    } finally {
      dispatch(logoutAction());
      navigate('/login', { replace: true });
      setLoading(false);
    }
  }, [dispatch, navigate]);

  const isAuthenticated = Boolean(user);

  if (!hydrated) {
    return <div>Loading authentication…</div>;
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, error, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
