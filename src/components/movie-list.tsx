import React, { useState } from 'react';
import { MovieProps } from '../types/movie-type';
import { AppRoute } from '../const';
import { Link } from 'react-router-dom';
import { useFavorites } from './favorite-store';
import { Modal } from 'react-bootstrap';

const PLACEHOLDER_IMAGE =
    'https://yastatic.net/s3/kinopoisk-frontend/common-static/img/projector-logo/placeholder.svg';

interface MovieListProps {
    movies: MovieProps[];
    showFavoriteButton?: boolean;
}

export function MovieList({
    movies,
    showFavoriteButton = true,
}: MovieListProps): JSX.Element {
    const { favorites, toggleFavorite, isFavorite } = useFavorites();
    const [showModal, setShowModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<MovieProps | null>(null);

    const handleFavoriteClick = (movie: MovieProps) => {
        if (isFavorite(movie.id)) {
            toggleFavorite(movie);
        } else {
            setSelectedMovie(movie);
            setShowModal(true);
        }
    };

    const handleConfirmAdd = () => {
        if (selectedMovie) {
            toggleFavorite(selectedMovie);
        }
        setShowModal(false);
        setSelectedMovie(null);
    };

    const handleCancelAdd = () => {
        setShowModal(false);
        setSelectedMovie(null);
    };

    return (
        <>
            <div className="list-group">
                {movies.map(
                    (movie) =>
                        movie.id && (
                            <div
                                key={movie.id}
                                className="list-group-item list-group-item-action d-flex align-items-center justify-content-between"
                            >
                                <Link
                                    className="d-flex align-items-center flex-grow-1"
                                    to={`${AppRoute.Movie.replace(':id', movie.id)}`}
                                    style={{
                                        textDecoration: 'none',
                                        color: 'inherit',
                                    }}
                                >
                                    <img
                                        src={
                                            movie.poster?.url ||
                                            PLACEHOLDER_IMAGE
                                        }
                                        alt={
                                            movie.name || movie.alternativeName
                                        }
                                        style={{
                                            width: '50px',
                                            height: '75px',
                                            objectFit: 'cover',
                                            marginRight: '15px',
                                        }}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                PLACEHOLDER_IMAGE;
                                        }}
                                    />

                                    <div className="d-flex flex-column">
                                        <span className="fw-bold">
                                            {movie.name ||
                                                movie.alternativeName}
                                        </span>

                                        <div className="d-flex gap-3 text-muted small">
                                            {movie.rating?.imdb && (
                                                <span>
                                                    IMDb: {movie.rating.imdb}
                                                </span>
                                            )}
                                            {movie.year && (
                                                <span>{movie.year}</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>

                                {showFavoriteButton && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleFavoriteClick(movie);
                                        }}
                                        className={`btn btn-sm ${isFavorite(movie.id) ? 'btn-warning' : 'btn-outline-secondary'}`}
                                        style={{ marginLeft: '15px' }}
                                        title={
                                            isFavorite(movie.id)
                                                ? 'Удалить из избранного'
                                                : 'Добавить в избранное'
                                        }
                                    >
                                        {isFavorite(movie.id) ? '★' : '☆'}
                                    </button>
                                )}
                            </div>
                        )
                )}
            </div>

            {/* Модальное окно подтверждения */}
            <Modal show={showModal} onHide={handleCancelAdd} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Добавить в избранное</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedMovie && (
                        <div className="d-flex align-items-center">
                            <img
                                src={
                                    selectedMovie.poster?.url ||
                                    PLACEHOLDER_IMAGE
                                }
                                alt={
                                    selectedMovie.name ||
                                    selectedMovie.alternativeName
                                }
                                style={{
                                    width: '50px',
                                    height: '75px',
                                    objectFit: 'cover',
                                    marginRight: '15px',
                                }}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        PLACEHOLDER_IMAGE;
                                }}
                            />
                            <div>
                                <h6>
                                    {selectedMovie.name ||
                                        selectedMovie.alternativeName}
                                </h6>
                                <p className="text-muted mb-0">
                                    {selectedMovie.year &&
                                        `Год: ${selectedMovie.year}`}
                                    {selectedMovie.rating?.imdb &&
                                        ` • IMDb: ${selectedMovie.rating.imdb}`}
                                </p>
                            </div>
                        </div>
                    )}
                    <p className="mt-3">
                        Вы уверены, что хотите добавить этот фильм в избранное?
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn btn-secondary"
                        onClick={handleCancelAdd}
                    >
                        Отменить
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleConfirmAdd}
                    >
                        Добавить в избранное
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
