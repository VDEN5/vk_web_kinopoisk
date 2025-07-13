import React, { createContext, useState, useContext } from 'react';
import { AuthContextType, AuthProviderProps } from '../types/types';
import { AuthorizationStatus } from '../const';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [authStatus, setAuthStatus] = useState<AuthorizationStatus>(
        AuthorizationStatus.NoAuth
    );

    return (
        <AuthContext.Provider value={{ authStatus, setAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
};
