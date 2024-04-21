const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/localfun', {
  useNewUrlParser: true,
  useUnifiedTopology: true, // Add this option for avoiding deprecation warning
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(express.json());

// Define route handlers
app.get('/', (req, res) => {
  res.send('<h1>Hello, Express.js Server!</h1>');
});

// Import and use userRoutes
const userRoute = require('./routes/api/userRoutes.js');
app.use('/users', userRoute);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
