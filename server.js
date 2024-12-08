const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "McLa1910",
    port: 3306,
    database: 'hangperson'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
    res.sendFile(path.join(__dirname, 'public', `/playingPage.html`));
});

var routes = [
    { menu: 'Play', link: '/welcomePage' },
    { menu: 'Leaderboard', link: '/leaderboard' },
    { menu: 'Settings', link: '/words' },
    { menu: 'LogOff', link: '/logoff' }
];
routes.forEach((route) => {
    console.log(route);
    app.get(`${route.link}`, (req, res) => {
        res.sendFile(path.join(__dirname, 'public', `/${route.link}.html`));
    });
});

app.get('/menu', (req, res) => {
    
    res.json(routes);
});

app.get('/add-word', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add-word.html'));
});

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
        res.json({ success: true, message: 'Word edited!' });
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

// Signup route
app.post('/signup', (req, res) => {
    const { firstName, email, username, pword } = req.body;

    const userQuery = 'INSERT INTO Users (firstName, email, username, pword) VALUES (?, ?, ?, ?)';
    const userValues = [firstName, email, username, pword];

    db.query(userQuery, userValues, (err, result) => {
        if (err) {
            console.error('Error inserting user data:', err);
            return res.status(500).send({ success: false, message: 'Database error inserting user' });
        }
        console.log('User inserted with ID:', result.insertId);  

        const userId = result.insertId;
        const leaderboardQuery = 'INSERT INTO leaderboard (username, user_id, puzzles_completed, daily_streak) VALUES (?, ?, ?, ?)';
        const leaderboardValues = [username, userId, 0, 0]; // Default values for puzzles_completed and daily_streak

        db.query(leaderboardQuery, leaderboardValues, (err, result) => {
            if (err) {
                console.error('Error inserting into leaderboard:', err);
                return res.status(500).send({ success: false, message: 'Database error inserting into leaderboard' });
            }

            console.log('Leaderboard entry created for user ID:', userId); 
            res.status(200).send({ success: true, message: 'User registered and leaderboard updated successfully' });
        });
    });
});

app.get('/leaderboard', (req, res) => {
    const query = 'SELECT username, puzzles_completed, daily_streak FROM leaderboard ORDER BY puzzles_completed DESC';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching leaderboard:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.json(results); 
    });
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
