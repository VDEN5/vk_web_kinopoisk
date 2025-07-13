import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMovieById } from '../api/api';
import { MovieProps } from '../types/movie-type';
import { AppRoute } from '../const';

const DEFAULT_POSTER = 'https://yastatic.net/s3/kinopoisk-frontend/common-static/img/projector-logo/placeholder.svg';

export const Movie = () => {
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<MovieProps | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentActorPage, setCurrentActorPage] = useState(1);
    const actorsPerPage = 10;
    const indexOfLastActor = currentActorPage * actorsPerPage;
    const indexOfFirstActor = indexOfLastActor - actorsPerPage;

    useEffect(() => {
        if (id) {
            const fetchMovie = async () => {
                try {
                    setLoading(true);
                    const response = await getMovieById(id);
                    setMovie(response.data);
                    
                    // Выводим информацию о фильме в консоль
                    console.log('Информация о фильме:', response.data);
                } catch (err) {
                    setError('Error fetching movie');
                    console.error('Ошибка при загрузке фильма:', err);
                } finally {
                    setLoading(false);
                }
            };
            fetchMovie();
        }
    }, [error, id]);

    if (loading) return <div className="alert alert-info">Загрузка...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!movie)
        return <div className="alert alert-warning">Movie not found.</div>;

    const currentActors = movie.persons?.slice(
        indexOfFirstActor,
        indexOfLastActor
    ) || [];

    const similarMoviesPosters =
        movie.similarMovies
            ?.map((similarMovie) => {
                return similarMovie.poster?.url
                    ? {
                          imageUrl: similarMovie.poster.url,
                          id: similarMovie.id,
                      }
                    : null;
            })
            .filter((poster) => poster !== null) || [];

    return (
        <div className="container mt-3">
            <Link to={AppRoute.Root} className="btn btn-primary mb-3">
                Назад
            </Link>
            <h1>{movie.name || movie.alternativeName}</h1>
            
            {/* Блок с основной информацией */}
            <div className="row mb-4">
                <div className="col-md-4">
                <img
                        src={movie.poster?.url || DEFAULT_POSTER}
                        alt={movie.name || movie.alternativeName}
                        className="img-fluid rounded"
                        style={{ maxWidth: '100%', height: 'auto' }}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = DEFAULT_POSTER;
                        }}
                    />
                </div>
                <div className="col-md-8">
                    <div className="mb-3">
                        <h3>Описание</h3>
                        <p>{movie.description || 'Нет описания'}</p>
                    </div>
                    
                    <div className="mb-3">
                        <h3>Краткое описание</h3>
                        <p>{movie.shortDescription || 'Нет краткого описания'}</p>
                    </div>
                    
                    <div className="mb-3">
                        <h3>Жанры</h3>
                        {movie.genres?.length > 0 ? (
                            <div className="d-flex flex-wrap gap-2">
                                {movie.genres.map((genre, index) => (
                                    <span key={index} className="badge bg-primary">
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p>Нет информации о жанрах</p>
                        )}
                    </div>
                    
                    <div className="mb-3">
                        <h3>Год выпуска</h3>
                        <p>{movie.year || 'Неизвестно'}</p>
                    </div>
                    
                    <div className="mb-3">
                        <h3>Рейтинг</h3>
                        <p>{movie.rating?.kp ? `${movie.rating.kp}/10` : 'Нет информации'}</p>
                    </div>
                </div>
            </div>

            <h3 className="mt-3">Актерский состав</h3>
            {movie.persons?.length > 0 ? (
                <>
                    <ul className="list-group mb-3">
                        {currentActors.map(
                            (person) =>
                                person.name && (
                                    <li
                                        key={person.id}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        {person.name}
                                        {person.enProfession && (
                                            <span className="badge bg-secondary">
                                                {person.enProfession}
                                            </span>
                                        )}
                                    </li>
                                )
                        )}
                    </ul>
                    
                </>
            ) : (
                <div className="alert alert-secondary">
                    Нет информации об актерах
                </div>
            )}            
        </div>
    );
};
