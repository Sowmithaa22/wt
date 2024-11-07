const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sowmi22',
    database: 'ecommerce'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database!');
});

// Routes
app.get('/', (req, res) => {
    res.send('E-Commerce Backend');
});

// Get all products
app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Get a single product by id
app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    });
});

// Add new product (for testing)
app.post('/products', (req, res) => {
    const { name, description, price, stock } = req.body;
    db.query('INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)', 
    [name, description, price, stock], (err, results) => {
        if (err) throw err;
        res.status(201).json({ message: 'Product added successfully', id: results.insertId });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
