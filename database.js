const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./keysystem.db');
const db = require('./database');

// Run table creations once when server starts
db.serialize(() => {
  // Admins table
  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  // Events table
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_name TEXT,
      event_date TEXT,
      start_time TEXT,
      end_time TEXT,
      room_number TEXT,
      event_type TEXT CHECK(event_type IN ('regular', 'exam', 'event'))
    )
  `);

  // Key logs table
  db.run(`
    CREATE TABLE IF NOT EXISTS keylogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_number TEXT,
      accessed_by TEXT,
      last_accessed TEXT
    )
  `);

  // Weekly schedule table (per admin)
  db.run(`
    CREATE TABLE IF NOT EXISTS schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_id INTEGER,
      day TEXT,
      start_time TEXT,
      end_time TEXT,
      room_number TEXT,
      FOREIGN KEY(admin_id) REFERENCES admins(id)
    )
  `);

  // Live room status table
  db.run(`
    CREATE TABLE IF NOT EXISTS room_status (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_number TEXT,
      current_user TEXT,
      subject TEXT,
      start_time TEXT,
      end_time TEXT
    )
  `);

  // Insert default admin (username: admin, password: admin)
  db.get(`SELECT * FROM admins WHERE username = 'admin'`, (err, row) => {
    if (!row) {
      db.run(`INSERT INTO admins (username, password) VALUES (?, ?)`, ['admin', 'admin']);
    }
  });
});

app.post('/api/events', (req, res) => {
  const { event_name, event_date, start_time, end_time, room_number, event_type } = req.body;
  const query = `INSERT INTO events (event_name, event_date, start_time, end_time, room_number, event_type)
                 VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(query, [event_name, event_date, start_time, end_time, room_number, event_type], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ message: 'Event added successfully', eventId: this.lastID });
  });
});


module.exports = db;