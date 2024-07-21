const express = require('express');
const { Client } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Create a connection to the database
const client = new Client({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'company_db'
});

client.connect(err => {
    if (err) throw err;
    console.log('Connected to the database.');
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
require('./db/index.js')(app, client);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
