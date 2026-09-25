const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve('../ecommerce/db.sqlite3');
const db = new sqlite3.Database(dbPath);

db.all("PRAGMA table_info(shop_category);", [], (err, rows) => {
  console.log("shop_category:", rows);
  db.all("PRAGMA table_info(shop_product);", [], (err, rows2) => {
    console.log("shop_product:", rows2);
    db.close();
  });
});
