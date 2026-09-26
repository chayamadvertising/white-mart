import sqlite3
import json

conn = sqlite3.connect('prisma/dev.db')
conn.row_factory = sqlite3.Row
c = conn.cursor()

tables = [row['name'] for row in c.execute("SELECT name FROM sqlite_master WHERE type='table';").fetchall()]
print("Tables:", tables)

if 'User' in tables:
    print("Users:", [dict(r) for r in c.execute("SELECT * FROM User").fetchall()])
if 'Product' in tables:
    print("Products:", [dict(r) for r in c.execute("SELECT * FROM Product").fetchall()])
