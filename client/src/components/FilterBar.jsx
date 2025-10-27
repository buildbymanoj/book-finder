/**
 * FilterBar Component
 * Smart filtering by genre and publication year
 */

import React, { useState } from 'react';
import './FilterBar.css';

const POPULAR_GENRES = [
  'Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller',
  'Romance', 'Horror', 'Historical Fiction', 'Biography', 'Non-fiction',
  'Self-Help', 'Business', 'Poetry', 'Children', 'Young Adult'
];

const FilterBar = ({ onFilterChange, activeFilters, onClearFilters }) => {
  const [selectedGenre, setSelectedGenre] = useState(activeFilters?.genre || '');
  const [yearFrom, setYearFrom] = useState(activeFilters?.yearFrom || '');
  const [yearTo, setYearTo] = useState(activeFilters?.yearTo || '');

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    const filters = { genre, yearFrom, yearTo };
    if (!genre) delete filters.genre;
    if (!yearFrom) delete filters.yearFrom;
    if (!yearTo) delete filters.yearTo;
    onFilterChange(filters);
  };

  const handleYearFromChange = (year) => {
    setYearFrom(year);
    const filters = { genre: selectedGenre, yearFrom: year, yearTo };
    if (!selectedGenre) delete filters.genre;
    if (!year) delete filters.yearFrom;
    if (!yearTo) delete filters.yearTo;
    onFilterChange(filters);
  };

  const handleYearToChange = (year) => {
    setYearTo(year);
    const filters = { genre: selectedGenre, yearFrom, yearTo: year };
    if (!selectedGenre) delete filters.genre;
    if (!yearFrom) delete filters.yearFrom;
    if (!year) delete filters.yearTo;
    onFilterChange(filters);
  };

  const handleQuickYear = (from, to) => {
    setYearFrom(from);
    setYearTo(to);
    const filters = { genre: selectedGenre, yearFrom: from, yearTo: to };
    if (!selectedGenre) delete filters.genre;
    onFilterChange(filters);
  };

  const handleClearAll = () => {
    setSelectedGenre('');
    setYearFrom('');
    setYearTo('');
    onClearFilters();
  };

  const hasActiveFilters = selectedGenre || yearFrom || yearTo;
  const currentYear = new Date().getFullYear();

  return (
    <div className="filter-bar-open">
      <div className="filter-row">
        {/* Genre Filter */}
        <div className="filter-item">
          <label htmlFor="genre-select" className="filter-label">
            Browse by Genre
          </label>
          <select
            id="genre-select"
            value={selectedGenre}
            onChange={(e) => handleGenreChange(e.target.value)}
            className="filter-select"
          >
            <option value="">All Genres</option>
            {POPULAR_GENRES.map((genre) => (
              <option key={genre} value={genre.toLowerCase()}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Year Range Filter */}
        <div className="filter-item">
          <label className="filter-label">Publication Year</label>
          <div className="year-range-inline">
            <input
              id="year-from"
              type="number"
              placeholder="From"
              value={yearFrom}
              onChange={(e) => handleYearFromChange(e.target.value)}
              min="1800"
              max={currentYear}
              className="year-input-inline"
            />
            <span className="year-separator">-</span>
            <input
              id="year-to"
              type="number"
              placeholder="To"
              value={yearTo}
              onChange={(e) => handleYearToChange(e.target.value)}
              min="1800"
              max={currentYear}
              className="year-input-inline"
            />
          </div>
        </div>

        {/* Quick Year Presets */}
        <div className="filter-item filter-presets">
          <label className="filter-label">Quick Select</label>
          <div className="year-presets-inline">
            <button
              type="button"
              onClick={() => handleQuickYear(currentYear - 1, currentYear)}
              className="preset-btn-small"
            >
              Last Year
            </button>
            <button
              type="button"
              onClick={() => handleQuickYear(currentYear - 5, currentYear)}
              className="preset-btn-small"
            >
              Last 5 Years
            </button>
            <button
              type="button"
              onClick={() => handleQuickYear(2000, currentYear)}
              className="preset-btn-small"
            >
              Since 2000
            </button>
            <button
              type="button"
              onClick={() => handleQuickYear('', 2000)}
              className="preset-btn-small"
            >
              Classics
            </button>
          </div>
        </div>

        {/* Clear Button */}
        {hasActiveFilters && (
          <div className="filter-item">
            <label className="filter-label">&nbsp;</label>
            <button
              onClick={handleClearAll}
              className="btn-clear-filters"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
