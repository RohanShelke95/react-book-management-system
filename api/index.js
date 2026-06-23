const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '../server/.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Rohan@12',
  database: process.env.DB_NAME || 'book_management',
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud.com')
    ? { rejectUnauthorized: false }
    : false
});

// GET /api/books
app.get('/api/books', async (req, res) => {
  try {
    let query = 'SELECT * FROM books WHERE 1=1';
    const params = [];

    const searchTerm = req.query.search || req.query.q;
    if (searchTerm) {
      query += ' AND (title LIKE ? OR author LIKE ?)';
      params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }

    if (req.query.genre && req.query.genre !== 'All') {
      query += ' AND genre = ?';
      params.push(req.query.genre);
    }

    if (req.query._sort) {
      const sortField = req.query._sort;
      const sortOrder = req.query._order && req.query._order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      const validColumns = ['id', 'title', 'author', 'genre', 'publication_year', 'status', 'rating', 'date_added'];
      if (validColumns.includes(sortField)) {
        query += ` ORDER BY ${sortField} ${sortOrder}`;
      }
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books', detail: error.message });
  }
});

// GET /api/books/:id
app.get('/api/books/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Book not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Failed to fetch book', detail: error.message });
  }
});

// POST /api/books
app.post('/api/books', async (req, res) => {
  try {
    const { title, author, genre, publication_year, cover_image, status, rating, date_added } = req.body;
    const finalDateAdded = date_added || new Date().toLocaleDateString('en-US');
    const [result] = await pool.query(
      `INSERT INTO books (title, author, genre, publication_year, cover_image, status, rating, date_added) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, author, genre, publication_year, cover_image, status, rating, finalDateAdded]
    );
    const [inserted] = await pool.query('SELECT * FROM books WHERE id = ?', [result.insertId]);
    res.status(201).json(inserted[0]);
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ error: 'Failed to add book', detail: error.message });
  }
});

// PUT /api/books/:id
app.put('/api/books/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { title, author, genre, publication_year, cover_image, status, rating, date_added } = req.body;
    const [existing] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Book not found' });

    await pool.query(
      `UPDATE books SET title = ?, author = ?, genre = ?, publication_year = ?, cover_image = ?, status = ?, rating = ?, date_added = ? WHERE id = ?`,
      [title, author, genre, publication_year, cover_image, status, rating, date_added || existing[0].date_added, id]
    );
    const [updated] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book', detail: error.message });
  }
});

// DELETE /api/books/:id
app.delete('/api/books/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM books WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book', detail: error.message });
  }
});

module.exports = app;
