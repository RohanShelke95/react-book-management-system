const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Enable standard middleware (CORS, static files, logging, body-parser)
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom query parameters mapping middleware
server.use((req, res, next) => {
  if (req.method === 'GET' && req.path === '/api/books') {
    // Map custom query `search` to JSON Server full-text search `q`
    if (req.query.search) {
      req.query.q = req.query.search;
      delete req.query.search;
    }
    // Handle 'All' genre by removing the genre filter so it returns all records
    if (req.query.genre === 'All') {
      delete req.query.genre;
    }
  }
  next();
});

// Re-write '/api/*' requests to '/*' to transparently match client expectations
server.use(jsonServer.rewriter({
  '/api/*': '/$1'
}));

// Route standard JSON Server requests
server.use(router);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
