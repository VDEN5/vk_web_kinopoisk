import { Studio } from './types/studios-types';

export enum AppRoute {
    Root = '/',
    Movie = '/movie/:id',
    Login = '/login',
    Favorite = '/favorite'
}

export enum AuthorizationStatus {
    Auth = 'AUTH',
    NoAuth = 'NO_AUTH',
    Unknown = 'UNKNOWN',
}

export const ageRating: string[] = ['0', '6', '12', '18'];

export const years: number[] = Array.from(
    { length: 2024 - 1895 + 1 },
    (_, index) => 1895 + index
);

export const numbers: number[] = Array.from(
    { length: (10 - 1) * 10 + 1 },
    (_, index) => 1.0 + index * 0.1
);

export const studiosName: string[] = ['HBO', 'Netflix', 'Amazon'];
