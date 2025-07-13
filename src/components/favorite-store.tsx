import { useState } from 'react';
import { MovieProps } from '../types/movie-type'; 

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<MovieProps[]>(() => {
        const saved = localStorage.getItem('favoriteMovies');
        return saved ? JSON.parse(saved) : [];
    });

    const toggleFavorite = (movie: MovieProps) => {
        setFavorites(prev => {
            const isAlreadyFavorite = prev.some(fav => fav.id === movie.id);
            const newFavorites = isAlreadyFavorite
                ? prev.filter(fav => fav.id !== movie.id)
                : [...prev, movie];
            
            localStorage.setItem('favoriteMovies', JSON.stringify(newFavorites));
            return newFavorites;
        });
    };

    const isFavorite = (movieId: number) => {
        return favorites.some(fav => fav.id === movieId);
    };

    const getAllFavorites = () => {
        return favorites;
    };

    const clearFavorites = () => {
        setFavorites([]);
        localStorage.removeItem('favoriteMovies');
    };

    return { 
        favorites, 
        toggleFavorite, 
        isFavorite, 
        getAllFavorites,
        clearFavorites
    };
};