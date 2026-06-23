import React from 'react';
import { Search } from 'lucide-react';

function FilterBar({ 
  searchQuery, 
  setSearchQuery, 
  selectedGenre, 
  setSelectedGenre, 
  genres,
  selectedStatus,
  setSelectedStatus,
  selectedAuthor,
  setSelectedAuthor,
  authors,
  onResetFilters
}) {
  return (
    <aside className="filters-panel">
      <h3>Filters</h3>

      <div className="filter-group">
        <label htmlFor="search-input">Search Title/Author</label>
        <div className="search-input-wrapper">
          <input
            id="search-input"
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn-search-trigger" aria-label="Search">
            <Search size={18} />
          </button>
        </div>
      </div>

      <div className="filter-group">
        <label htmlFor="genre-select">Genre</label>
        <select
          id="genre-select"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          {genres.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="status-select">Status</label>
        <select
          id="status-select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="On Shelf">On Shelf</option>
          <option value="Borrowed">Borrowed</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="author-select">Author</label>
        <select
          id="author-select"
          value={selectedAuthor}
          onChange={(e) => setSelectedAuthor(e.target.value)}
        >
          <option value="All">All Authors</option>
          {authors.map(author => (
            <option key={author} value={author}>{author}</option>
          ))}
        </select>
      </div>

      <button className="btn-reset-filters" onClick={onResetFilters}>
        Reset All Filters
      </button>
    </aside>
  );
}

export default FilterBar;
