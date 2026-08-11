import React, { createContext, useState, useEffect, useCallback } from 'react';
import { userApi } from '../api/userApi';
import { authApi } from '../api/authApi';
import { getStoredToken, setStoredToken, removeStoredToken } from '../utils/storageUtils';

export const AuthContext = createContext({
  currentUser: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  authError: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearAuthError: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getStoredToken());
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Logout & clear state
  const logout = useCallback(() => {
    removeStoredToken();
    setToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
  }, []);

  // Hydrate user session on app load if token exists
  useEffect(() => {
    let isMounted = true;

    const hydrateUser = async () => {
      const existingToken = getStoredToken();
      if (!existingToken) {
        if (isMounted) {
          setIsLoading(false);
          setIsAuthenticated(false);
        }
        return;
      }

      try {
        const user = await userApi.getCurrentUser();
        if (isMounted) {
          setCurrentUser(user);
          setIsAuthenticated(true);
          setToken(existingToken);
        }
      } catch (err) {
        if (isMounted) {
          logout();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    hydrateUser();

    // Listen for 401 unauthorized events dispatched by API client
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      isMounted = false;
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [logout]);

  // Login handler
  const login = async (credentials) => {
    setAuthError(null);
    try {
      const authResponse = await authApi.login(credentials);
      // authResponse = { token, tokenType, user }
      const newToken = authResponse.token;
      setStoredToken(newToken);
      setToken(newToken);
      setCurrentUser(authResponse.user);
      setIsAuthenticated(true);
      return authResponse;
    } catch (err) {
      setAuthError(err.message || 'Login failed');
      throw err;
    }
  };

  // Register handler
  const register = async (registerData) => {
    setAuthError(null);
    try {
      const authResponse = await authApi.register(registerData);
      const newToken = authResponse.token;
      setStoredToken(newToken);
      setToken(newToken);
      setCurrentUser(authResponse.user);
      setIsAuthenticated(true);
      return authResponse;
    } catch (err) {
      setAuthError(err.message || 'Registration failed');
      throw err;
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isAuthenticated,
        isLoading,
        authError,
        login,
        register,
        logout,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
