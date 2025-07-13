import React from 'react';
import { Navigate } from 'react-router-dom';
import { PrivateRouteProps } from '../types/types';
import { AppRoute, AuthorizationStatus } from '../const';
import { useAuth } from './auth-context';

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { authStatus } = useAuth();

    return authStatus === AuthorizationStatus.Auth ? (
        children
    ) : (
        <Navigate to={AppRoute.Login} replace />
    );
};
