const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes

// Create Student
app.post('/students', (req, res) => {
  const { name, email } = req.body;
  db.run(`INSERT INTO students(name, email) VALUES(?, ?)`, [name, email], function (err) {
    if (err) return res.status(400).json(err);
    res.json({ id: this.lastID });
  });
});

// Read Students
app.get('/students', (req, res) => {
  db.all(`SELECT * FROM students`, [], (err, rows) => {
    if (err) return res.status(400).json(err);
    res.json(rows);
  });
});

// Update Student
app.put('/students/:id', (req, res) => {
  const { name, email } = req.body;
  db.run(`UPDATE students SET name=?, email=? WHERE id=?`, [name, email, req.params.id], function (err) {
    if (err) return res.status(400).json(err);
    res.json({ updated: this.changes });
  });
});

// Delete Student
app.delete('/students/:id', (req, res) => {
  db.run(`DELETE FROM students WHERE id=?`, req.params.id, function (err) {
    if (err) return res.status(400).json(err);
    res.json({ deleted: this.changes });
  });
});

// Catch-all to serve index.html on root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(3000, () => console.log('✅ Server running at http://localhost:3000'));
