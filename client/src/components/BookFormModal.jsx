import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function BookFormModal({ isOpen, onClose, onSubmit, editingBook, genres }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Fiction');
  const [publicationYear, setPublicationYear] = useState('');
  const [coverImage, setCoverImage] = useState('');

  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title || '');
      setAuthor(editingBook.author || '');
      setGenre(editingBook.genre || 'Fiction');
      setPublicationYear(editingBook.publication_year || '');
      setCoverImage(editingBook.cover_image || '');
    } else {
      setTitle('');
      setAuthor('');
      setGenre('Fiction');
      setPublicationYear('');
      setCoverImage('');
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
      cover_image: coverImage
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card animate-fade-in">
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

          <div className="form-group">
            <label htmlFor="form-cover">Cover Image URL (Optional)</label>
            <input
              id="form-cover"
              type="url"
              placeholder="https://example.com/cover.jpg"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
            />
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
