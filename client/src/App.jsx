import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import BookList from './components/BookList';
import BookFormModal from './components/BookFormModal';
import ErrorBanner from './components/ErrorBanner';
import Loader from './components/Loader';
import './App.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const GENRES = [
  'All',
  'Fiction',
  'Non-Fiction',
  'Self-Help',
  'Classics',
  'Education',
  'Poetry',
  'Business',
  'Mystery',
  'Sci-Fi'
];

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/books?search=${searchQuery}&genre=${selectedGenre}`);
      if (!response.ok) throw new Error('Failed to load books');
      const booksData = await response.json();
      setBooks(booksData);
      console.log('🟢 Fetched books →', booksData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Could not connect to the database API. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedGenre]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (formData) => {
    try {
      const url = editingBook ? `${API_BASE}/books/${editingBook.id}` : `${API_BASE}/books`;
      const method = editingBook ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to save book record');

      setShowAddModal(false);
      setEditingBook(null);
      fetchData();
    } catch (err) {
      console.error('Error saving book:', err);
      alert('Error saving book: ' + err.message);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this book from the collection?')) return;
    try {
      const res = await fetch(`${API_BASE}/books/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete book');
      fetchData();
    } catch (err) {
      console.error('Error deleting book:', err);
      alert('Error deleting book: ' + err.message);
    }
  };

  const handleAddClick = () => {
    setEditingBook(null);
    setShowAddModal(true);
  };

  return (
    <div className="app-container">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddClick={handleAddClick}
      />

      <main className="content">
        <ErrorBanner error={error} onRetry={fetchData} />

        <FilterBar
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          genres={GENRES}
        />

        {loading ? (
          <Loader />
        ) : (
          <BookList
            books={books}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddClick={handleAddClick}
          />
        )}
      </main>

      <BookFormModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setEditingBook(null); }}
        onSubmit={handleSubmit}
        editingBook={editingBook}
        genres={GENRES}
      />
    </div>
  );
}

export default App;
