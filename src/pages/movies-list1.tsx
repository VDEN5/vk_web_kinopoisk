import React, { useState, useEffect, useCallback } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { MovieList } from '../components/movie-list';
import { AppRoute, AuthorizationStatus } from '../const';
import { useAuth } from '../components/auth-context';
import { useFavorites } from '../components/favorite-store';

export function MoviesList1() {
    const { favorites, getAllFavorites } = useFavorites();
    const [movies, setMovies] = useState<MovieProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const navigate = useNavigate();
    const { authStatus } = useAuth();

    const fetchFavoriteMovies = useCallback(async () => {
        setLoading(true);
        try {
            const favoriteMovies = getAllFavorites();
            setMovies(favoriteMovies);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [getAllFavorites]);

    useEffect(() => {
        if (authStatus === AuthorizationStatus.Auth) {
            fetchFavoriteMovies();
        }
    }, [authStatus, fetchFavoriteMovies]);

    if (authStatus !== AuthorizationStatus.Auth) {
        return <Navigate to={AppRoute.Login} replace />;
    }

    if (loading) return <div className="alert alert-info">Загрузка...</div>;
    if (error) {
        return (
            <div className="alert alert-danger">
                Ошибка:{' '}
                {error instanceof Error ? error.message : 'Произошла ошибка'}
            </div>
        );
    }

    return (
        <div className="container mt-3">
            <Link to={AppRoute.Root} className="btn btn-primary mb-3">
                Назад
            </Link>
            <h1 className="text-center">Мои избранные фильмы</h1>
            {movies.length > 0 ? (
                <MovieList movies={movies} showFavoriteButton={true} />
            ) : (
                <div className="alert alert-warning">
                    У вас пока нет избранных фильмов
                </div>
            )}
        </div>
    );
}
