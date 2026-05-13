const express = require('express'); // П af
const mysql = require('mysql2');
const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'vet_clin'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to vet_clin database');
});

app.get('/animals', (req, res) => {
  db.query('SELECT * FROM animals', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get('/animals/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM animals WHERE animal_id = ?', [id], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

app.post('/animals', (req, res) => {
  const { name, species, breed, birth_date, owner_id } = req.body;
  db.query(
    'INSERT INTO animals (name, species, breed, birth_date, owner_id) VALUES (?, ?, ?, ?, ?)',
    [name, species, breed, birth_date, owner_id],
    (err, results) => {
      if (err) throw err;
      res.json({ message: 'Animal added', id: results.insertId });
    }
  );
});

app.put('/animals/:id', (req, res) => {
  const { name, species, breed, birth_date, owner_id } = req.body;
  const { id } = req.params;
  db.query(
    'UPDATE animals SET name=?, species=?, breed=?, birth_date=?, owner_id=? WHERE animal_id=?',
    [name, species, breed, birth_date, owner_id, id],
    (err) => {
      if (err) throw err;
      res.json({ message: 'Animal updated' });
    }
  );
});

app.delete('/animals/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM animals WHERE animal_id=?', [id], (err) => {
    if (err) throw err;
    res.json({ message: 'Animal deleted' });
  });
});

app.listen(3000, () => console.log('Server started on port 3000'));
