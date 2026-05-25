import React from 'react';
import { BookOpen, Plus } from 'lucide-react';
import SearchBar from './SearchBar';

function Header({ searchQuery, setSearchQuery, onAddClick }) {
  return (
    <header className="header animate-fade-in">
      <div className="logo">
        <BookOpen size={32} className="logo-icon" />
        <h1>Athena</h1>
      </div>

      <div className="header-actions">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <button className="btn-primary" onClick={onAddClick}>
          <Plus size={18} />
          <span>Add Book</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
