'use client';
import { User } from '@/lib/types/user.types';
import React, { ReactNode } from 'react';

interface IAuthContextValue {
  currentUser: User;
  token: string;
}
const AuthContext = React.createContext<IAuthContextValue | null>(null);

const AuthProvider = ({
  children,
  token,
  user,
}: {
  children: ReactNode;
  user: User;
  token: string;
}) => {
  return (
    <AuthContext.Provider
      value={{
        currentUser: user,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const context = React.use(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider.');
  }

  return context;
};
