const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve('../ecommerce/db.sqlite3');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, rows) => {
      if (err) {
        throw err;
      }
      rows.forEach((row) => {
        console.log(row.name);
      });
      db.close();
    });
  }
});
