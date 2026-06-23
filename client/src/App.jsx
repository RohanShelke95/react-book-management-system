import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import FilterBar from './components/FilterBar';
import BookList from './components/BookList';
import BookFormModal from './components/BookFormModal';
import ErrorBanner from './components/ErrorBanner';
import Loader from './components/Loader';
import VirtualShelves from './components/VirtualShelves';
import { BookOpen, Users, CheckCircle, BookCopy, Plus, Star } from 'lucide-react';

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

  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('library-theme') === 'dark';
  });

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedAuthor, setSelectedAuthor] = useState('All');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('library-theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('library-theme', 'light');
    }
  }, [darkMode]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE}/books`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load books');
      const booksData = await response.json();
      setBooks(booksData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(
        'Could not connect to the database API. Make sure the backend server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('All');
    setSelectedStatus('All');
    setSelectedAuthor('All');
  };

  // Compute list of unique authors dynamically
  const authorsList = [...new Set(books.map(b => b.author))].sort();

  // Filter books in memory for instant reactivity
  const filteredBooks = books.filter(book => {
    const matchesSearch = searchQuery.trim() === '' || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;
    const matchesStatus = selectedStatus === 'All' || book.status === selectedStatus;
    const matchesAuthor = selectedAuthor === 'All' || book.author === selectedAuthor;
    
    return matchesSearch && matchesGenre && matchesStatus && matchesAuthor;
  });

  // Calculate statistics
  const totalCount = books.length;
  const borrowedCount = books.filter(b => b.status === 'Borrowed').length;
  const onShelfCount = books.filter(b => b.status === 'On Shelf' || !b.status).length;
  const topGenre = books.length > 0 
    ? Object.entries(books.reduce((acc, b) => { acc[b.genre] = (acc[b.genre] || 0) + 1; return acc; }, {}))
        .sort((a, b) => b[1] - a[1])[0][0]
    : 'None';

  // Render content based on activeTab
  const renderTabContent = () => {
    if (loading) return <Loader />;
    if (error) return <ErrorBanner error={error} onRetry={fetchData} />;

    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="middle-grid animate-fade-in">
              <VirtualShelves 
                books={filteredBooks} 
                onBookClick={handleEdit}
                onAddClick={handleAddClick}
              />
              <FilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                genres={GENRES}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                selectedAuthor={selectedAuthor}
                setSelectedAuthor={setSelectedAuthor}
                authors={authorsList}
                onResetFilters={handleResetFilters}
              />
            </div>

            <BookList
              books={filteredBooks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddClick={handleAddClick}
            />
          </>
        );

      case 'library':
        return (
          <div className="animate-fade-in">
            <div className="inventory-panel" style={{ border: 'none', background: 'transparent', padding: 0 }}>
              <div className="inventory-header" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>All Books Catalog</h3>
                <button className="btn-primary" onClick={handleAddClick}>
                  <Plus size={18} /> Add Book
                </button>
              </div>
              <BookList
                books={filteredBooks}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddClick={handleAddClick}
              />
            </div>
          </div>
        );

      case 'additions':
        // Sort by ID descending to show newest first
        const sortedAdditions = [...filteredBooks].sort((a, b) => b.id - a.id);
        return (
          <div className="animate-fade-in">
            <div className="inventory-panel" style={{ border: 'none', background: 'transparent', padding: 0 }}>
              <div className="inventory-header" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Recently Added Books</h3>
              </div>
              <BookList
                books={sortedAdditions}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddClick={handleAddClick}
              />
            </div>
          </div>
        );

      case 'authors':
        // Get list of authors with book counts
        const authorCounts = books.reduce((acc, b) => {
          acc[b.author] = (acc[b.author] || 0) + 1;
          return acc;
        }, {});
        
        return (
          <div className="inventory-panel animate-fade-in">
            <div className="inventory-header">
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Authors Collection</h3>
            </div>
            <div className="table-wrapper">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Author Name</th>
                    <th>Books in Library</th>
                    <th>Status Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(authorCounts).map(([author, count]) => {
                    const authorBooks = books.filter(b => b.author === author);
                    const borrowed = authorBooks.filter(b => b.status === 'Borrowed').length;
                    const shelf = count - borrowed;
                    return (
                      <tr key={author}>
                        <td style={{ fontWeight: 600 }}>{author}</td>
                        <td>{count} {count === 1 ? 'Book' : 'Books'}</td>
                        <td>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {shelf} on shelf, {borrowed} borrowed
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="inventory-panel animate-fade-in" style={{ maxWidth: '600px' }}>
            <div className="inventory-header" style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Library Settings</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '6px' }}>Theme Option</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Choose between light mode and dark mode preferences.
                </p>
                <button className="theme-toggle-btn" onClick={() => setDarkMode(!darkMode)} style={{ width: 'auto' }}>
                  {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>
              </div>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: '6px' }}>System Info</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Connected to Local JSON database API: <code style={{ background: 'var(--primary-light)', padding: '2px 6px', borderRadius: '4px' }}>{API_BASE}</code>
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />

      <main className="main-content">
        <header className="dashboard-header animate-fade-in">
          <div className="welcome-section">
            <h2>My Dashboard</h2>
            <p>Welcome back, Eleanor!</p>
          </div>

          <div className="stats-container">
            <div className="stat-widget">
              <div className="stat-icon-box total">
                <BookOpen size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{totalCount}</span>
                <span className="stat-label">Total Books</span>
              </div>
            </div>

            <div className="stat-widget">
              <div className="stat-icon-box borrowed">
                <BookCopy size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{borrowedCount}</span>
                <span className="stat-label">Borrowed</span>
              </div>
            </div>

            <div className="stat-widget">
              <div className="stat-icon-box shelf">
                <CheckCircle size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{onShelfCount}</span>
                <span className="stat-label">On Shelf</span>
              </div>
            </div>

            <div className="stat-widget">
              <div className="stat-icon-box total" style={{ background: '#fef3c7', color: '#d97706' }}>
                <Star size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-value" style={{ fontSize: '0.95rem', fontWeight: 700 }}>{topGenre}</span>
                <span className="stat-label">Top Genre</span>
              </div>
            </div>
          </div>
        </header>

        {renderTabContent()}
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
