const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// Configure MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Aj157881!",
    port: 3307,
    database: 'hangperson'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serves static files (CSS, JS, etc.)
// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
    res.sendFile(path.join(__dirname, 'public', `/playingPage.html`));
});

var routes = [
    { menu: 'Play', link: '/welcomePage' },
    { menu: 'Leaderboard', link: '/leaderboard' },
    { menu: 'Settings', link: '/words' },
    { menu: 'LogOff', link: '/logoff' }
    ]
routes.forEach((route) => {
    console.log(route);
    app.get(`${route.link}`, (req, res) => {
        res.sendFile(path.join(__dirname, 'public', `/${route.link}.html`));
    });
})


app.get('/menu', (req, res) => {
    
    res.json(routes);
});

app.get('/add-word', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add-word.html'));
});

// Login API 
app.all('/login', (req, res) => {
    const { username, pword } = req.body;
    console.log(req.body);
    const query = 'SELECT * FROM Users WHERE username = ? && pword = ?';
    db.query(query, [username, pword], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json({ success: true, message: 'Login successful' });
        } else {
            res.json({ success: true, message: 'Invalid username or password' });
        }
    });
});

// Words API 
app.get('/get-words', (req, res) => {
    const query = 'SELECT * FROM words';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/add-word', (req, res) => {
    const { word } = req.body;
    console.log(req.body); 
    const query = 'INSERT INTO words (word) VALUES (?)';
    db.query(query, [word], (err, result) => {
        if (err) throw err;
        res.json({ success: true, message: 'Word added!' });
    });
});

app.post('/edit-word', (req, res) => {
    const { id, word } = req.body;
    console.log(req.body); 
    const query = 'UPDATE words SET word = ? WHERE id = ?';
    db.query(query, [word, id], (err, result) => {
        if (err) throw err;
        res.json({ success: true, message: 'Word adited!' });
    });
});

app.post('/delete-word', (req, res) => {
    const { id } = req.body;
    console.log(req.body); 
    const query = 'DELETE FROM words WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) throw err;
        res.json({ success: true, message: 'Word deleted!' });
    });
});

// Start server 
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});