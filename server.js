const express = require('express');
const routes = require('./routes'); // Import routes from routes/index.js

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for JSON body parsing (if needed)
app.use(express.json());

// Load all routes
app.use('/', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
