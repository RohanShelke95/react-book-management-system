import React from 'react';
import { Filter } from 'lucide-react';

function FilterBar({ selectedGenre, setSelectedGenre, genres }) {
  return (
    <section className="filters-row animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="filter-title">
        <Filter size={14} />
        <span>Genre:</span>
      </div>
      <div className="filter-buttons">
        {genres.map(g => (
          <button
            key={g}
            className={`filter-btn ${selectedGenre === g ? 'active' : ''}`}
            onClick={() => setSelectedGenre(g)}
          >
            {g}
          </button>
        ))}
      </div>
    </section>
  );
}

export default FilterBar;
