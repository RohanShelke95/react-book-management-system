// server/index.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Enable standard middleware (CORS, static files, logging, body-parser)
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Re‑write '/api/*' → '/*' so the client can use /api/books
server.use(jsonServer.rewriter({
  '/api/*': '/$1',
}));

// ---------------------------------------------------------------
// SINGLE, clean middleware – strips empty params and logs final query
// ---------------------------------------------------------------
server.use((req, res, next) => {
  if (req.method === 'GET' && (req.path === '/api/books' || req.path === '/books')) {
    // Map custom `search` to json-server full-text search `q`
    if (req.query.search) {
      req.query.q = req.query.search;
    }
    delete req.query.search; // remove empty/handled param

    // Remove genre filter when "All" is selected
    if (req.query.genre === 'All') {
      delete req.query.genre;
    }

    // Log the **final** query that json-server will see
    console.log('🔎 Middleware final → path:', req.path, 'query:', req.query);
  }
  next();
});

// Route standard JSON Server requests
server.use(router);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
