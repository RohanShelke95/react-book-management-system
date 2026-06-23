import React from 'react';
import BookCard from './BookCard';

function VirtualShelves({ books, onBookClick, onAddClick }) {
  // Display up to 10 books distributed across 2 shelves (5 per shelf)
  const maxBooksToShow = 10;
  const activeBooks = books.slice(0, maxBooksToShow);
  
  const shelf1Books = activeBooks.slice(0, 5);
  const shelf2Books = activeBooks.slice(5, 10);

  return (
    <div className="shelves-panel">
      <div className="shelves-header">
        <h3>Virtual Bookshelves</h3>
        <button className="btn-shelf-action" onClick={onAddClick}>
          Add Book
        </button>
      </div>

      {books.length === 0 ? (
        <div className="wood-shelf">
          <div className="empty-shelf-text">No books found matching filters.</div>
          <div className="wood-shelf-board" />
        </div>
      ) : (
        <>
          {/* Shelf 1 */}
          <div className="wood-shelf">
            {shelf1Books.map((book, index) => (
              <div 
                key={book.id} 
                className="shelf-book"
                onClick={() => onBookClick(book)}
                title={`Click to edit: "${book.title}" by ${book.author}`}
              >
                <img 
                  src={book.cover_image || 'https://images.unsplash.com/photo-1543004629-ff569f872783?auto=format&fit=crop&q=80&w=400'} 
                  alt={book.title}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1543004629-ff569f872783?auto=format&fit=crop&q=80&w=400';
                  }}
                />
              </div>
            ))}
            {shelf1Books.length === 0 && (
              <div className="empty-shelf-text">Shelf empty</div>
            )}
            <div className="wood-shelf-board" />
          </div>

          {/* Shelf 2 */}
          <div className="wood-shelf">
            {shelf2Books.map((book, index) => (
              <div 
                key={book.id} 
                className="shelf-book"
                onClick={() => onBookClick(book)}
                title={`Click to edit: "${book.title}" by ${book.author}`}
              >
                <img 
                  src={book.cover_image || 'https://images.unsplash.com/photo-1543004629-ff569f872783?auto=format&fit=crop&q=80&w=400'} 
                  alt={book.title}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1543004629-ff569f872783?auto=format&fit=crop&q=80&w=400';
                  }}
                />
              </div>
            ))}
            {shelf2Books.length === 0 && shelf1Books.length > 0 && (
              <div className="empty-shelf-text">Shelf empty</div>
            )}
            <div className="wood-shelf-board" />
          </div>
        </>
      )}
    </div>
  );
}

export default VirtualShelves;
