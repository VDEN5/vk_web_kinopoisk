import React, { useState } from 'react';
import { SearchBarProps } from '../types/types';

export function SearchBar({
    searchQuery,
    onSearchChange,
    onLimitChange,
    limit,
    genres,
    countries,
    onAgeChange,
    selectedAge,
    selectedGenre,
    onGenreChange,
    selectedCountry,
    onCountryChange,
    onRatingChange,
    selectedRating,
    onYearsChange,
    selectedYears
}: SearchBarProps): JSX.Element {
    const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(10);
  const [minYear, setMinYear] = useState(1990);
  const [maxYear, setMaxYear] = useState(2025);
    return (
        <div className="container my-3">
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Поиск фильмов..."
                    value={searchQuery}
                    onChange={onSearchChange}
                />
            </div>
            <div className="mb-3">
  <label htmlFor="genre-select" className="form-label">
    Выбери жанры (можно несколько):
  </label>
  <select
    id="genre-select"
    className="form-select"
    multiple
    value={selectedGenre || []}
    onChange={(e) => {
      const options = e.target.options;
      const selected = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selected.push(options[i].value);
        }
      }
      onGenreChange(selected);
    }}
  >
    <option value="">Выбери жанр...</option>
    {genres.map((genre) => (
      <option key={genre.name} value={genre.name}>
        {genre.name}
      </option>
    ))}
  </select>
</div>
            <div className="mb-3">
    <label htmlFor="rating-range" className="form-label">
        Выбери диапазон рейтинга: {selectedRating || "0-10"}
    </label>
    <div className="d-flex align-items-center gap-3">
        <input
            type="range"
            className="form-range"
            min="0"
            max="10"
            step="1"
            value={selectedRating?.split('-')[0] || 0}
            onChange={(e) => {
                const min = Math.min(Number(e.target.value), selectedRating?.split('-')[1] || 10);
                onRatingChange(`${min}-${selectedRating?.split('-')[1] || 10}`);
            }}
        />
        <input
            type="range"
            className="form-range"
            min="0"
            max="10"
            step="1"
            value={selectedRating?.split('-')[1] || 10}
            onChange={(e) => {
                const max = Math.max(Number(e.target.value), selectedRating?.split('-')[0] || 0);
                onRatingChange(`${selectedRating?.split('-')[0] || 0}-${max}`);
            }}
        />
    </div>
    <div className="d-flex justify-content-between mt-1">
        <span>0</span>
        <span>10</span>
    </div>
</div>
<div className="mb-3">
    <label htmlFor="years-range" className="form-label">
        Выбери диапазон years: {selectedYears || "1990-2025"}
    </label>
    <div className="d-flex align-items-center gap-3">
        <input
            type="range"
            className="form-range"
            min="1990"
            max="2025"
            step="1"
            value={selectedYears?.split('-')[0] || 1990}
            onChange={(e) => {
                const min = Math.min(Number(e.target.value), selectedYears?.split('-')[1] || 2025);
                onYearsChange(`${min}-${selectedYears?.split('-')[1] || 2025}`);
            }}
        />
        <input
            type="range"
            className="form-range"
            min="1990"
            max="2025"
            step="1"
            value={selectedYears?.split('-')[1] || 2025}
            onChange={(e) => {
                const max = Math.max(Number(e.target.value), selectedYears?.split('-')[0] || 1990);
                onYearsChange(`${selectedYears?.split('-')[0] || 1990}-${max}`);
            }}
        />
    </div>
    <div className="d-flex justify-content-between mt-1">
        <span>1990</span>
        <span>2025</span>
    </div>
</div>
        </div>
    );
}
