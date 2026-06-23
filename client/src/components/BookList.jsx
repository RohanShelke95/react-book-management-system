import React from 'react';
import { BookMarked, Edit3, Trash2, Plus } from 'lucide-react';

function BookList({ books, onEdit, onDelete, onAddClick }) {
  const defaultCover = 'https://images.unsplash.com/photo-1543004629-ff569f872783?auto=format&fit=crop&q=80&w=400';

  const renderStars = (rating = 5) => {
    return (
      <div className="rating-stars">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i}>{i < rating ? '★' : '☆'}</span>
        ))}
      </div>
    );
  };

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
    <div className="inventory-panel animate-fade-in">
      <div className="inventory-header">
        <h3>Inventory Overview</h3>
      </div>
      
      <div className="table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Status</th>
              <th>Date Added</th>
              <th>Rating</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>
                  <div className="table-book-title">
                    <img 
                      className="table-cover-thumb"
                      src={book.cover_image || defaultCover} 
                      alt={book.title} 
                      onError={(e) => {
                        e.target.src = defaultCover;
                      }}
                    />
                    <span className="table-book-name">{book.title}</span>
                  </div>
                </td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>
                  <span className={`status-pill ${book.status === 'Borrowed' ? 'borrowed' : 'on-shelf'}`}>
                    {book.status || 'On Shelf'}
                  </span>
                </td>
                <td>{book.date_added || 'N/A'}</td>
                <td>{renderStars(book.rating)}</td>
                <td style={{ textAlign: 'right' }}>
                  <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                    <button 
                      className="table-btn edit" 
                      title="Edit Details" 
                      onClick={() => onEdit(book)}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      className="table-btn delete" 
                      title="Delete Record" 
                      onClick={() => onDelete(book.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookList;
