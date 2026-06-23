const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Rohan@12',
  database: process.env.DB_NAME || 'book_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// GET /api/books
app.get('/api/books', async (req, res) => {
  try {
    let query = 'SELECT * FROM books WHERE 1=1';
    const params = [];

    // Search query mapping (equivalent to json-server 'q' or 'search')
    const searchTerm = req.query.search || req.query.q;
    if (searchTerm) {
      query += ' AND (title LIKE ? OR author LIKE ?)';
      params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }

    // Genre filtering
    if (req.query.genre && req.query.genre !== 'All') {
      query += ' AND genre = ?';
      params.push(req.query.genre);
    }

    // Sorting (equivalent to json-server '_sort' and '_order')
    if (req.query._sort) {
      const sortField = req.query._sort;
      const sortOrder = req.query._order && req.query._order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      // Basic protection against SQL injection by allowing only valid columns for sort
      const validColumns = ['id', 'title', 'author', 'genre', 'publication_year', 'status', 'rating', 'date_added'];
      if (validColumns.includes(sortField)) {
         query += ` ORDER BY ${sortField} ${sortOrder}`;
      }
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// GET /api/books/:id
app.get('/api/books/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// POST /api/books
app.post('/api/books', async (req, res) => {
  try {
    const { title, author, genre, publication_year, cover_image, status, rating, date_added } = req.body;
    
    // Default values if missing
    const finalDateAdded = date_added || new Date().toLocaleDateString('en-US');
    
    const [result] = await pool.query(
      `INSERT INTO books (title, author, genre, publication_year, cover_image, status, rating, date_added)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, author, genre, publication_year, cover_image, status, rating, finalDateAdded]
    );

    // Return the inserted book
    const [inserted] = await pool.query('SELECT * FROM books WHERE id = ?', [result.insertId]);
    res.status(201).json(inserted[0]);
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ error: 'Failed to add book' });
  }
});

// PUT /api/books/:id
app.put('/api/books/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { title, author, genre, publication_year, cover_image, status, rating, date_added } = req.body;
    
    // Ensure book exists first
    const [existing] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    await pool.query(
      `UPDATE books 
       SET title = ?, author = ?, genre = ?, publication_year = ?, cover_image = ?, status = ?, rating = ?, date_added = ?
       WHERE id = ?`,
      [title, author, genre, publication_year, cover_image, status, rating, date_added || existing[0].date_added, id]
    );

    // Return the updated book
    const [updated] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// DELETE /api/books/:id
app.delete('/api/books/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM books WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

app.listen(PORT, () => {
  console.log(`Express Server with MySQL is running on port ${PORT}`);
});
