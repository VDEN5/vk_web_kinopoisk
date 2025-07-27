type ExternalId = {
    kpHD: string;
    imdb: string;
    tmdb: number;
};

type Name = {
    name: string;
    language: string;
    type: string;
};

type Rating = {
    kp: number;
    imdb: number;
    tmdb: number;
    filmCritics: number;
    russianFilmCritics: number;
    await: number;
};

export type Votes = {
    kp: number;
    imdb: number;
    tmdb: number;
    filmCritics: number;
    russianFilmCritics: number;
    await: number;
};

type Logo = {
    url: string;
};

export type Poster = {
    url: string;
    previewUrl: string;
};

type Video = {
    url: string;
    name: string;
    site: string;
    type: string;
    size: number;
};

type Genre = {
    name: string;
};

type Country = {
    name: string;
};

type Person = {
    id: number;
    photo: string;
    name: string;
    enName: string;
    description: string;
    profession: string;
    enProfession: string;
};

type Money = {
    value: number;
    currency: string;
};

type Premiere = {
    country: string;
    world: string;
    russia: string;
    digital: string;
    cinema: string;
    bluray: string;
    dvd: string;
};

export type SimilarMovie = {
    id: number;
    rating: Rating;
    year: number;
    name: string;
    enName: string;
    alternativeName: string;
    type: string;
    poster: Poster;
};

type SequelPrequel = {
    id: number;
    rating: Rating;
    year: number;
    name: string;
    enName: string;
    alternativeName: string;
    type: string;
    poster: Poster;
};

type LogoUrl = {
    url: string;
};

type WatchabilityItem = {
    name: string;
    logo: LogoUrl;
    url: string;
};

type ReleaseYears = {
    start: number;
    end: number;
};

type Audience = {
    count: number;
    country: string;
};

type NetworksItem = {
    name: string;
    logo: LogoUrl;
};

type Network = {
    items: NetworksItem[];
};

type Fact = {
    value: string;
    type: string;
    spoiler: boolean;
};

type ImagesInfo = {
    postersCount: number;
    backdropsCount: number;
    framesCount: number;
};

export type MovieProps = {
    id: number;
    externalId: ExternalId;
    name: string;
    alternativeName: string;
    enName: string;
    names: Name[];
    type: string;
    typeNumber: number;
    year: number;
    description: string;
    shortDescription: string;
    slogan: string;
    status: string;
    rating: Rating;
    votes: Votes;
    movieLength: number;
    ratingMpaa: string;
    ageRating: string;
    logo: Logo;
    poster: Poster;
    backdrop: Poster;
    videos: {
        trailers: Video[];
        teasers: Video[];
    };
    genres: Genre[];
    countries: Country[];
    persons: Person[];
    seasonsInfo: SeasonInfo[];
    budget: Money;
    fees: {
        world: Money;
        russia: Money;
        usa: Money;
    };
    premiere: Premiere;
    similarMovies?: SimilarMovie[] | null;
    sequelsAndPrequels: SequelPrequel[];
    watchability: {
        items: WatchabilityItem[];
    };
    releaseYears: ReleaseYears[];
    top10: number;
    top250: number;
    ticketsOnSale: boolean;
    totalSeriesLength: number;
    seriesLength: number;
    isSeries: boolean;
    audience: Audience[];
    lists: string[];
    networks: Network[];
    updatedAt: string;
    createdAt: string;
    facts: Fact[];
    imagesInfo: ImagesInfo;
};

export type MoviePage = {
    docs: MovieProps[];
    limit: number;
    page: number;
    pages: number;
    total: number;
};
