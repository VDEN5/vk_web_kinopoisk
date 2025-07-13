export type Movie = {
    id: number;
};

export type Studio = {
    id: string;
    subType: string;
    title: string;
    type: string;
    movies: Movie[];
    createdAt: string;
    updatedAt: string;
};

export type StudiosProps = {
    docs: Studio[];
    total: number;
    limit: number;
    page: number;
    pages: number;
};
