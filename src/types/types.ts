import { AuthorizationStatus } from '../const';
import React, { ChangeEvent, ReactNode, SetStateAction } from 'react';
import { Studio } from './studios-types';

export type AuthContextType = {
    authStatus: AuthorizationStatus;
    setAuthStatus: React.Dispatch<SetStateAction<AuthorizationStatus>>;
};

export type AuthProviderProps = {
    children: ReactNode;
};

export type PrivateRouteProps = {
    children: JSX.Element;
};

export type ImagesUrlProps = {
    imageUrl: string;
    id: number;
};



export type Genre = {
    name: string;
    slug: string;
};

export type Country = {
    name: string;
    slug: string;
};

export type ContentType = {
    name: string;
    slug: string;
};


export type SearchBarProps = {
    searchQuery: string;
    onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onLimitChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    limit: number;
    genres: Genre[];
    countries: Country[];
    onAgeChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    selectedAge: string;
};
