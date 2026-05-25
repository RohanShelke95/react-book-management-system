import React from 'react';
import { Search } from 'lucide-react';

function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="search-wrapper">
      <Search size={18} className="search-icon" />
      <input
        type="text"
        placeholder="Search by title or author..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
