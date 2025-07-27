import React, { ChangeEvent, useState, useEffect, useCallback } from 'react';
import {
    Link,
    Navigate,
    useLocation,
    useNavigate,
    useSearchParams,
} from 'react-router-dom';
import {
    getMoviesByName,
    getMovies,
    getGenres,
    getCountries,
} from '../api/api';
import { MovieProps } from '../types/movie-type';
import { SearchBar } from '../components/search-bar';
import { debounce } from '../utils/debounce';
import { MovieList } from '../components/movie-list';
import { Country, Genre } from '../types/types';
import { AppRoute, AuthorizationStatus } from '../const';
import { AuthContext, AuthProvider, useAuth } from '../components/auth-context';
import { useFavorites } from '../components/favorite-store';

export function MoviesList() {
    const [movies, setMovies] = useState<MovieProps[]>([]);
    const [searchResults, setSearchResults] = useState<MovieProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [numberOfPages, setNumberOfPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [error, setError] = useState<Error | null>(null);
    const [allMovies, setAllMovies] = useState<MovieProps[]>([]);
    const [visibleMovies, setVisibleMovies] = useState<MovieProps[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [selectedRating, setSelectedRating] = useState<string>('');
    const [selectedYears, setSelectedYears] = useState<string>('');
    const [selectedGenre, setSelectedGenre] = useState<string[]>([]);
    const [selectedAge, setSelectedAge] = useState<string>('');
    const [limit, setLimit] = useState<number>(50);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [genres, setGenres] = useState<Genre[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [searchHistory, setSearchHistory] = useState<string[]>(() => {
        const saved = localStorage.getItem('searchHistory');
        return saved ? JSON.parse(saved) : [];
    });

    const { authStatus } = useAuth();

    if (authStatus !== AuthorizationStatus.Auth) {
        return <Navigate to={AppRoute.Login} replace />;
    }

    const updateSearchParams = useCallback(() => {
        const params = {};

        if (selectedGenre) params['genre'] = selectedGenre;
        if (selectedCountry) params['country'] = selectedCountry;
        if (selectedRating) params['rating'] = selectedRating;
        if (selectedYears) params['years'] = selectedYears;
        if (selectedAge) params['age'] = selectedAge;
        if (searchQuery) params['query'] = searchQuery;

        params['page'] = currentPage.toString();
        params['limit'] = limit.toString();

        setSearchParams(params);
    }, [
        currentPage,
        limit,
        searchQuery,
        selectedGenre,
        selectedCountry,
        selectedRating,
        selectedYears,
        selectedAge,
        setSearchParams,
    ]);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [genresResponse, countriesResponse] = await Promise.all([
                    getGenres(),
                    getCountries(),
                ]);
                setGenres(genresResponse.data);
                setCountries(countriesResponse.data);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchFilters();
    }, []);

    const fetchMovies = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getMovies(
                currentPage.toString(),
                limit.toString(),
                selectedAge,
                selectedGenre,
                selectedCountry,
                selectedRating,
                selectedYears
            );
            setMovies(response.data.docs);
            setNumberOfPages(response.data.pages);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [
        currentPage,
        limit,
        selectedAge,
        selectedGenre,
        selectedCountry,
        selectedRating,
        selectedYears,
    ]);

    const debouncedFetchMoviesByName = useCallback(
        debounce(async (name: string) => {
            if (name) {
                setLoading(true);
                try {
                    const response = await getMoviesByName(
                        currentPage.toString(),
                        limit.toString(),
                        name
                    );
                    setSearchResults(response.data.docs);
                    setNumberOfPages(response.data.pages);
                } catch (err) {
                    setError(err as Error);
                } finally {
                    setLoading(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 1000),
        [currentPage, limit]
    );

    useEffect(() => {
        if (searchQuery) {
            debouncedFetchMoviesByName(searchQuery);
        } else {
            fetchMovies();
        }
    }, [searchQuery, debouncedFetchMoviesByName, fetchMovies]);

    useEffect(() => {
        if (searchQuery !== null) {
            debouncedFetchMoviesByName(searchQuery);
        }
    }, [searchQuery, debouncedFetchMoviesByName]);

    useEffect(() => {
        updateSearchParams();
    }, [
        selectedGenre,
        selectedCountry,
        selectedRating,
        selectedYears,
        selectedAge,
        searchQuery,
        updateSearchParams,
    ]);

    useEffect(() => {
        const newPage = parseInt(searchParams.get('page') || '1', 10);
        const newLimit = parseInt(searchParams.get('limit') || '50', 10);
        fetchMovies();
        setCurrentPage(newPage);
        setLimit(newLimit);
    }, [searchParams]);

    const loadMoreMovies = useCallback(async () => {
        if (isLoadingMore || !hasMore) return;

        // Сохраняем текущую позицию скролла
        const scrollPosition = window.scrollY;
        // Отключаем скролл
        document.body.style.overflow = 'hidden';

        setIsLoadingMore(true);
        try {
            const nextPage = currentPage + 1;
            const response = searchQuery
                ? await getMoviesByName(
                      nextPage.toString(),
                      limit.toString(),
                      searchQuery
                  )
                : await getMovies(
                      nextPage.toString(),
                      limit.toString(),
                      selectedAge,
                      selectedGenre,
                      selectedCountry,
                      selectedRating,
                      selectedYears
                  );

            const newMovies = response.data.docs;
            setAllMovies((prev) => [...prev, ...newMovies]);
            setVisibleMovies((prev) => [...prev, ...newMovies.slice(0, limit)]);
            setNumberOfPages(response.data.pages);
            setCurrentPage(nextPage);
            setHasMore(newMovies.length > 0);
        } catch (err) {
            console.error('Ошибка загрузки фильмов:', err);
        } finally {
            // Восстанавливаем скролл после небольшой задержки
            setTimeout(() => {
                document.body.style.overflow = '';
                console.log(scrollPosition);
                window.scrollTo(0, 200);
                setIsLoadingMore(false);
            }, 100); // Небольшая задержка для плавности
        }
    }, [
        currentPage,
        limit,
        selectedAge,
        selectedGenre,
        selectedCountry,
        selectedRating,
        selectedYears,
        searchQuery,
        isLoadingMore,
        hasMore,
    ]);

    useEffect(() => {
        const handleScroll = debounce(() => {
            const { scrollTop, scrollHeight, clientHeight } =
                document.documentElement;
            const isNearBottom = scrollTop + clientHeight >= scrollHeight - 200;

            if (isNearBottom && !isLoadingMore && hasMore) {
                loadMoreMovies();
            }
        }, 200);

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMoreMovies, isLoadingMore, hasMore]);

    useEffect(() => {
        const fetchInitialMovies = async () => {
            setLoading(true);
            setHasMore(true);
            try {
                const response = searchQuery
                    ? await getMoviesByName('1', limit.toString(), searchQuery)
                    : await getMovies(
                          '1',
                          limit.toString(),
                          selectedAge,
                          selectedGenre,
                          selectedCountry,
                          selectedRating,
                          selectedYears
                      );

                setAllMovies(response.data.docs);
                setVisibleMovies(response.data.docs.slice(0, 50));
                setNumberOfPages(response.data.pages);
                setCurrentPage(1);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialMovies();
    }, [
        selectedAge,
        selectedGenre,
        selectedCountry,
        selectedRating,
        selectedYears,
        limit,
        searchQuery,
    ]);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setSearchQuery(newQuery);

        if (newQuery !== '') {
            setSelectedGenre([]);
            setSelectedCountry('');
            setSelectedRating('');
            setSelectedYears('');
            setSelectedAge('');
        }

        const updatedHistory = [
            newQuery,
            ...searchHistory.filter((item) => item !== newQuery),
        ];
        if (updatedHistory.length > 20) {
            updatedHistory.length = 20;
        }
        setSearchHistory(updatedHistory);
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    };

    const handleGenreChange = (genres: string[]) => {
        setSelectedGenre(selectedGenre.concat(genres));
        setSearchQuery('');
        fetchMovies();
    };

    const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedCountry(e.target.value);
        setSearchQuery('');
        fetchMovies();
    };

    const handleRatingChange = (ratingRange: string) => {
        setSelectedRating(ratingRange);
        setSearchQuery('');
        fetchMovies();
    };

    const handleYearsChange = (ratingRange: string) => {
        setSelectedYears(ratingRange);
        setSearchQuery('');
        fetchMovies();
    };

    const handleAgeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedAge(e.target.value);
        setSearchQuery('');
        fetchMovies();
    };

    const handleChangeNumber = (e: ChangeEvent<HTMLSelectElement>) => {
        const newLimit = parseInt(e.target.value, 10);
        setLimit(newLimit);
        setSearchParams({
            page: currentPage.toString(),
            limit: newLimit.toString(),
        });
    };

    if (loading) return <div className="alert alert-info">Загрузка...</div>;
    if (error)
        return (
            <div className="alert alert-danger">
                Ошибка:{' '}
                {error instanceof Error ? error.message : 'Произошла ошибка'}
            </div>
        );

    const moviesToShow = searchQuery ? searchResults : movies;

    return (
        <div className="container mt-3">
            <Link to={AppRoute.Favorite} className="btn btn-primary mb-3">
                Избранные фильмы
            </Link>
            <h1 className="text-center">Список фильмов</h1>
            <SearchBar
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onLimitChange={handleChangeNumber}
                limit={limit}
                genres={genres}
                countries={countries}
                onAgeChange={handleAgeChange}
                selectedAge={selectedAge}
                selectedGenre={selectedGenre}
                onGenreChange={handleGenreChange}
                selectedCountry={selectedCountry}
                onCountryChange={handleCountryChange}
                selectedRating={selectedRating}
                onRatingChange={handleRatingChange}
                selectedYears={selectedYears}
                onYearsChange={handleYearsChange}
            />
            <MovieList movies={visibleMovies} showFavoriteButton={true} />
            {isLoadingMore && (
                <div className="text-center my-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Загрузка...</span>
                    </div>
                </div>
            )}

            {!hasMore && !isLoadingMore && (
                <div className="text-center my-4 text-muted">
                    Вы достигли конца списка
                </div>
            )}
            {numberOfPages === 0 && (
                <div className="alert alert-warning" role="alert">
                    Фильмы не найдены
                </div>
            )}
        </div>
    );
}
