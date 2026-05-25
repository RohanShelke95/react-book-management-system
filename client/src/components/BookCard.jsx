import React from 'react';
import { Calendar, Edit3, Trash2 } from 'lucide-react';

function BookCard({ book, index, onEdit, onDelete }) {
  const defaultCover = 'https://images.unsplash.com/photo-1543004629-ff569f872783?auto=format&fit=crop&q=80&w=400';

  return (
    <div
      className="book-card animate-fade-in"
      style={{ animationDelay: `${0.05 * (index % 12)}s` }}
    >
      <div className="book-cover">
        <img 
          src={book.cover_image || defaultCover} 
          alt={book.title} 
          onError={(e) => {
            e.target.src = defaultCover;
          }}
        />
      </div>
      <div className="book-info">
        <div className="book-meta">
          <span className="book-genre">{book.genre}</span>
          <span className="book-divider">•</span>
          <span className="book-year">
            <Calendar size={12} className="meta-icon" />
            {book.publication_year}
          </span>
        </div>
        <h3 className="book-title" title={book.title}>{book.title}</h3>
        <p className="book-author">by {book.author}</p>

        <div className="book-actions">
          <button 
            className="action-btn edit" 
            title="Edit Details" 
            onClick={() => onEdit(book)}
          >
            <Edit3 size={18} />
          </button>
          <button 
            className="action-btn delete" 
            title="Delete Record" 
            onClick={() => onDelete(book.id)}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
