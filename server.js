const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SQLite DB connection
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) return console.error(err.message);
  console.log('Connected to SQLite database.');
  initializeDatabase(); // Initialize tables after connection
});

// Create tables if not existing
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_id INTEGER,
      event_name TEXT,
      event_date TEXT,
      start_time TEXT,
      end_time TEXT,
      room_number TEXT,
      event_type TEXT,
      subject TEXT,
      FOREIGN KEY (admin_id) REFERENCES admins(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_id INTEGER,
      monday TEXT,
      tuesday TEXT,
      wednesday TEXT,
      thursday TEXT,
      friday TEXT,
      saturday TEXT,
      sunday TEXT,
      FOREIGN KEY (admin_id) REFERENCES admins(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS key_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room TEXT,
      accessed_by TEXT,
      last_accessed TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS room_status (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room TEXT,
      current_user TEXT,
      subject TEXT,
      time TEXT,
      time_remaining TEXT
    )
  `);
}

// LOGIN
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM admins WHERE username = ?`;
  db.get(query, [username], async (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (!row) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, row.password);
    if (match) {
      res.json({ message: 'Login successful', user: row });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

// ADD EVENT
app.post('/api/events', (req, res) => {
  const { admin_id, event_name, event_date, start_time, end_time, room_number, event_type, subject } = req.body;

  const query = `INSERT INTO events (admin_id, event_name, event_date, start_time, end_time, room_number, event_type, subject)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(query, [admin_id, event_name, event_date, start_time, end_time, room_number, event_type, subject || ''], function (err) {
    if (err) {
      console.error('Database insert error:', err.message);
      res.status(500).json({ message: 'Failed to add event' });
    } else {
      res.status(201).json({ message: 'Event added successfully' });
    }
  });
});

// ADMIN REGISTER
app.post('/api/admins/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  const checkQuery = `SELECT * FROM admins WHERE username = ?`;
  db.get(checkQuery, [username], async (err, row) => {
    if (err) return res.status(500).json({ message: 'Error checking admin' });
    if (row) return res.status(400).json({ message: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = `INSERT INTO admins (username, password) VALUES (?, ?)`;
    db.run(insertQuery, [username, hashedPassword], function (err) {
      if (err) return res.status(500).json({ message: 'Failed to register admin' });

      const scheduleQuery = `INSERT INTO schedules (admin_id) VALUES (?)`;
      db.run(scheduleQuery, [this.lastID]);

      res.json({ message: 'Admin registered successfully', admin_id: this.lastID });
    });
  });
});

// ADMIN SCHEDULE
app.put('/api/admins/:id/schedule', (req, res) => {
  const { id } = req.params;
  const { day, schedule } = req.body;

  const allowedDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  if (!allowedDays.includes(day)) {
    return res.status(400).json({ message: 'Invalid day provided' });
  }

  const updateQuery = `UPDATE schedules SET ${day} = ? WHERE admin_id = ?`;
  db.run(updateQuery, [JSON.stringify(schedule), id], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Failed to update schedule' });
    }

    res.json({ message: 'Schedule updated successfully' });
  });
});

// KEY LOG
app.get('/key-logs', (req, res) => {
  db.all('SELECT * FROM key_logs', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// LIVE ROOM STATUS
app.get('/api/live-status', (req, res) => {
  const currentTime = new Date().toISOString().slice(0, 16).replace('T', ' ');

  const query = `
    SELECT 
      events.room_number,
      events.event_type,
      events.subject,
      events.start_time,
      events.end_time,
      admins.username AS current_user
    FROM events
    JOIN admins ON events.admin_id = admins.id
    WHERE datetime(start_time) <= datetime(?) AND datetime(end_time) >= datetime(?)
  `;

  db.all(query, [currentTime, currentTime], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching live room status' });
    }

    const now = new Date();

    const result = rows.map(row => {
      const start = new Date(row.start_time);
      const end = new Date(row.end_time);
      const duration = (end - start) / 1000;
      const elapsed = (now - start) / 1000;
      const remaining = duration - elapsed;
      const percent = Math.max(0, Math.min(100, (elapsed / duration) * 100));

      return {
        room_number: row.room_number,
        current_user: row.current_user,
        subject: row.subject,
        start_time: row.start_time,
        end_time: row.end_time,
        remaining_minutes: Math.floor(remaining / 60),
        progress: percent.toFixed(1)
      };
    });

    res.json(result);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
