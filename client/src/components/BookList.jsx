import React from 'react';
import { BookMarked, Plus } from 'lucide-react';
import BookCard from './BookCard';

function BookList({ books, onEdit, onDelete, onAddClick }) {
  if (books.length === 0) {
    return (
      <div className="empty-state animate-fade-in">
        <BookMarked size={48} className="empty-icon" />
        <h3>No books in collection</h3>
        <p>Try searching for another title or author, or insert a fresh book record into the system.</p>
        <button className="btn-primary" onClick={onAddClick}>
          <Plus size={18} /> Add Your First Book
        </button>
      </div>
    );
  }

  return (
    <section className="books-grid">
      {books.map((book, index) => (
        <BookCard
          key={book.id}
          book={book}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}

export default BookList;
