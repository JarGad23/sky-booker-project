"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "./types";
import { api } from "./api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [token] = useState(() => api.getToken());

  const { data: user = null, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => api.getMe(),
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
  });

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await api.login(email, password);
      queryClient.setQueryData(["user"], result.user);
    },
    [queryClient]
  );

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
    }) => {
      const result = await api.register(data);
      queryClient.setQueryData(["user"], result.user);
    },
    [queryClient]
  );

  const logout = useCallback(() => {
    api.logout();
    queryClient.setQueryData(["user"], null);
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo(
    () => ({
      user,
      isLoading: !!token && isLoading,
      login,
      register,
      logout,
    }),
    [user, token, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
