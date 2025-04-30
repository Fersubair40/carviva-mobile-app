import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { AuthState, User } from '@/types/user';
import { router, SplashScreen } from 'expo-router';
import { queryClient } from '@/app/_layout';
import { bool } from 'yup';
import request from '@/api/request';

interface AuthContextType extends AuthState {
  logout: () => Promise<void>;
}

const initialState: AuthState = {
  token: null,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>(initialState);

  SplashScreen.preventAutoHideAsync();
  // Check for existing session on load
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');

        if (token) {
          await request.get('/api/v1/users', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          // queryClient.invalidateQueries({ queryKey: ['userProfile'] });
          SplashScreen.hideAsync();
          setState({
            token,
            isLoading: false,
          });
        } else {
          setState({
            token: null,
            isLoading: false,
          });
          SplashScreen.hideAsync();
          router.replace('/login');
        }
      } catch (error) {
        // router.replace('/login');
      }
    };

    loadUser();
  }, []);

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      setState({
        token: null,
        isLoading: false,
      });
      router.replace('/login');
    } catch (error) {
      setState({
        ...state,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
