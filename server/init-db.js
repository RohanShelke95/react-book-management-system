const mysql = require('mysql2/promise');
const fs = require('fs');

async function initialize() {
  console.log('Starting database initialization...');
  
  // Connect without database to create it if it doesn't exist
  require('dotenv').config();
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Rohan@12',
    port: process.env.DB_PORT || 3306
  });

  try {
    await connection.query('CREATE DATABASE IF NOT EXISTS book_management');
    console.log('Database book_management checked/created.');
    
    await connection.query('USE book_management');
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        genre VARCHAR(100) NOT NULL,
        publication_year INT,
        cover_image TEXT,
        status VARCHAR(50),
        rating INT,
        date_added VARCHAR(50)
      )
    `);
    console.log('Table "books" checked/created.');

    // Check if there's data in db.json
    if (fs.existsSync('./db.json')) {
      const dbData = JSON.parse(fs.readFileSync('./db.json', 'utf-8'));
      if (dbData.books && dbData.books.length > 0) {
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM books');
        if (rows[0].count === 0) {
          console.log('Seeding initial data from db.json...');
          for (const book of dbData.books) {
            await connection.query(
              `INSERT INTO books (title, author, genre, publication_year, cover_image, status, rating, date_added)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [book.title, book.author, book.genre, book.publication_year, book.cover_image, book.status, book.rating, book.date_added]
            );
          }
          console.log('Seeding complete.');
        } else {
          console.log('Table "books" already contains data. Skipping seed.');
        }
      }
    }
  } catch (err) {
    console.error('Error during database initialization:', err);
  } finally {
    await connection.end();
  }
}

initialize();
