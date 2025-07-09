require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoute = require('./routes/auth.route');
const itemRoute = require('./routes/item.route');

const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

//authentication
app.use('/auth', authRoute);
app.use('/item', itemRoute);

module.exports = app;
