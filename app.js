const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use('/api', require('./routes/api'));

// Default route
app.get('/', (req, res) => res.send('API is running...'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
