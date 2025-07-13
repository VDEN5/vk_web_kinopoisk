import axios, { AxiosResponse } from 'axios';
import { token } from './token';
import { MoviePage, MovieProps } from '../types/movie-type';
import { ContentType, Country, Genre } from '../types/types';
import { StudiosProps } from '../types/studios-types';

export const BASE_URL = 'https://api.kinopoisk.dev/v1.4';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const api = axios.create({
    baseURL: BASE_URL,
});

const delay = (duration) =>
    new Promise((resolve) => setTimeout(resolve, duration));

api.interceptors.request.use(
    (config) => {
        config.headers['X-API-KEY'] = token;
        if (!config['retryCount']) {
            config['retryCount'] = 0;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: any) => {
        const config = error.config;
        if (
            error.response &&
            error.response.status === 503 &&
            config['retryCount'] < MAX_RETRIES
        ) {
            config['retryCount'] += 1;
            await delay(RETRY_DELAY);
            return api(config);
        }
        return Promise.reject(error);
    }
);

const apiV1 = axios.create({
    baseURL: BASE_URL.replace('v1.4', 'v1'),
});

apiV1.interceptors.request.use(
    (config) => {
        config.headers['X-API-KEY'] = token;
        if (!config['retryCount']) {
            config['retryCount'] = 0;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiV1.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: any) => {
        const config = error.config;
        if (
            error.response &&
            error.response.status === 503 &&
            config['retryCount'] < MAX_RETRIES
        ) {
            config['retryCount'] += 1;
            await delay(RETRY_DELAY);
            return api(config);
        }
        return Promise.reject(error);
    }
);

export const getMovies: (
    pageNumber: string,
    limit: string,
    ageRating?: string,
    genreName?: string[],
    countryName?: string,
    Rating?: string,
    years?: string
) => Promise<AxiosResponse<MoviePage, unknown>> = (
    pageNumber,
    limit,
    ageRating,
    genreName,
    countryName,
    Rating,
    years
) => {
    let query = `/movie?page=${pageNumber}&limit=${limit}`;
    if (ageRating) query += `&ageRating=${ageRating}`;
    if (genreName){
        if (genreName.length > 0) {
            genreName.forEach(genre => {
              query += `&genres.name=${encodeURIComponent(genre)}`;
            });
          }
    } //query += `&genres.name=${encodeURIComponent(genreName)}`;
    if (Rating){
        const [minRating, maxRating] = Rating.split('-').map(Number);
        query += `&rating.imdb=${encodeURIComponent(Rating)}`;
    }
    if (countryName)
        query += `&countries.name=${encodeURIComponent(countryName)}`;
    if (years) {
        const [startYear, endYear] = years.split('-').map(Number);
        // Генерируем параметры для каждого года в диапазоне
        for (let year = startYear; year <= endYear; year++) {
            query += `&year=${year}`;
        }
    }
    console.log(query)

    return api.get<MoviePage>(query);
};

export const getMovieById: (
    id: string
) => Promise = (id: string) =>
    api.get(`/movie/${id}`);

export const getMoviesByName: (
    pageNumber: string,
    limit: string,
    name: string
) => Promise<AxiosResponse<MoviePage, unknown>> = (
    pageNumber: string,
    limit: string,
    name: string
) =>
    api.get<MoviePage>(
        `/movie/search?page=${pageNumber}&limit=${limit}&query=${name}`
    );


export const getStudios: (
    pageNumber: string,
    limit: string
) => Promise<AxiosResponse<StudiosProps, unknown>> = (
    pageNumber: string,
    limit: string
) => api.get<StudiosProps>(`/studio?page=${pageNumber}&limit=${limit}`);

export const getGenres: () => Promise<AxiosResponse<Genre[], unknown>> = () =>
    apiV1.get<Genre[]>(`/movie/possible-values-by-field?field=genres.name`);

export const getCountries: () => Promise<
    AxiosResponse<Country[], unknown>
> = () =>
    apiV1.get<Country[]>(
        `/movie/possible-values-by-field?field=countries.name`
    );

export const getContentType: () => Promise<
    AxiosResponse<ContentType[], unknown>
> = () =>
    apiV1.get<ContentType[]>(`/movie/possible-values-by-field?field=type`);


