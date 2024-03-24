const express = require('express');
const mysql = require('mysql');

const app = express();
const PORT = 3000;

// MySQL database configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rock',
    database: 'mydb'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL database');
});

app.use(express.json());

// header for CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Create a new user
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Failed to create user');
            return;
        }
        res.status(201).send('User created successfully');
    });
});

// Get all users
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Failed to fetch users');
            return;
        }
        res.status(200).json(results);
    });
});


// Get a user by ID
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Failed to fetch user');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('User not found');
            return;
        }
        res.status(200).json(results[0]);
    });
});

// Update a user by ID
app.put('/users/:id', (req, res) => {
    const { name, email } = req.body;
    const { id } = req.params;
    db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Failed to update user');
            return;
        }
        res.status(201).send('User updated successfully');
    });
});

// Delete a user by ID
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Failed to delete user');
            return;
        }
        res.status(200).send('User deleted successfully');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
