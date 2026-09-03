const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const transactionRoutes = require('./routes/transactions');
const budgetRoutes = require('./routes/budgets');
const savingRoutes = require('./routes/savings');

app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/savings', savingRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to FinTrack API' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
