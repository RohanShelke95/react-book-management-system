import React from 'react';
import { BookOpen } from 'lucide-react';

function Header({ searchQuery, setSearchQuery, onAddClick, onSearchClick }) {
  return (
    <header className="header animate-fade-in">
      <div className="logo">
        <BookOpen size={32} className="logo-icon" />
        <h1>Athena</h1>
      </div>

      <div className="header-actions">
        <div className="search-wrapper">
          <input
            id="search-input"
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Search button */}
        <button className="btn-primary" onClick={onAddClick}>
          <span>Add Book</span>
        </button>
      </div>
    </header>
  );
}



export default Header;

