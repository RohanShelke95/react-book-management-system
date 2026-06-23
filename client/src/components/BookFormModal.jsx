import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function BookFormModal({ isOpen, onClose, onSubmit, editingBook, genres }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Fiction');
  const [publicationYear, setPublicationYear] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState('On Shelf');
  const [rating, setRating] = useState(5);
  const [dateAdded, setDateAdded] = useState('');

  useEffect(() => {
    const formattedToday = new Date().toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });

    if (editingBook) {
      setTitle(editingBook.title || '');
      setAuthor(editingBook.author || '');
      setGenre(editingBook.genre || 'Fiction');
      setPublicationYear(editingBook.publication_year || '');
      setCoverImage(editingBook.cover_image || '');
      setStatus(editingBook.status || 'On Shelf');
      setRating(editingBook.rating || 5);
      setDateAdded(editingBook.date_added || formattedToday);
    } else {
      setTitle('');
      setAuthor('');
      setGenre('Fiction');
      setPublicationYear('');
      setCoverImage('');
      setStatus('On Shelf');
      setRating(5);
      setDateAdded(formattedToday);
    }
  }, [editingBook, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      author,
      genre,
      publication_year: parseInt(publicationYear) || new Date().getFullYear(),
      cover_image: coverImage,
      status,
      rating: parseInt(rating) || 5,
      date_added: dateAdded
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in">
        <div className="modal-header">
          <h3>{editingBook ? 'Modify Book Details' : 'Add New Book to Library'}</h3>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="form-title">Book Title *</label>
            <input
              id="form-title"
              type="text"
              required
              placeholder="e.g. Dune"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="form-author">Author *</label>
            <input
              id="form-author"
              type="text"
              required
              placeholder="e.g. Frank Herbert"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="form-genre">Genre *</label>
              <select
                id="form-genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                {genres.slice(1).map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="form-year">Publication Year *</label>
              <input
                id="form-year"
                type="number"
                required
                min="1"
                max={currentYear + 1}
                placeholder="e.g. 1965"
                value={publicationYear}
                onChange={(e) => setPublicationYear(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="form-status">Status *</label>
              <select
                id="form-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="On Shelf">On Shelf</option>
                <option value="Borrowed">Borrowed</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="form-rating">Rating *</label>
              <select
                id="form-rating"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
              >
                <option value={1}>★☆☆☆☆ (1 Star)</option>
                <option value={2}>★★☆☆☆ (2 Stars)</option>
                <option value={3}>★★★☆☆ (3 Stars)</option>
                <option value={4}>★★★★☆ (4 Stars)</option>
                <option value={5}>★★★★★ (5 Stars)</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="form-date">Date Added *</label>
              <input
                id="form-date"
                type="text"
                required
                placeholder="MM/DD/YYYY"
                value={dateAdded}
                onChange={(e) => setDateAdded(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="form-cover">Cover Image URL</label>
              <input
                id="form-cover"
                type="url"
                placeholder="https://example.com/cover.jpg"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingBook ? 'Save Changes' : 'Add to Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookFormModal;
