const { Client } = require('pg');
const sqlite3 = require('sqlite3').verbose();

async function migrate() {
    const sqliteDb = new sqlite3.Database('prisma/dev.db', (err) => {
        if (err) console.error("SQLite connection error:", err.message);
        else console.log("Connected to SQLite dev.db");
    });

    const pgClient = new Client({
        connectionString: 'postgres://9f56cb9740d1c00541de3038a91ff4702a7900e9c827ae2e6679de783d4a11c4:sk_3z2rJBnEe_J4mwOGGovva@db.prisma.io:5432/postgres?sslmode=require',
    });

    await pgClient.connect();
    console.log("Connected to PostgreSQL");

    // Fetch data from SQLite
    const users = await new Promise((resolve) => sqliteDb.all("SELECT * FROM User", (err, rows) => resolve(rows)));
    const categories = await new Promise((resolve) => sqliteDb.all("SELECT * FROM Category", (err, rows) => resolve(rows)));
    const products = await new Promise((resolve) => sqliteDb.all("SELECT * FROM Product", (err, rows) => resolve(rows)));

    console.log(`Found ${users.length} users, ${categories.length} categories, ${products.length} products`);

    // Insert Users
    for (const u of users) {
        try {
            await pgClient.query(`INSERT INTO "User" (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`, 
            [u.id, u.name, u.email, u.password, u.role]);
        } catch(e) { console.error("Error user:", e.message) }
    }
    
    // Insert Categories
    for (const c of categories) {
        try {
            await pgClient.query(`INSERT INTO "Category" (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`, 
            [c.id, c.name]);
        } catch(e) { console.error("Error category:", e.message) }
    }

    // Insert Products
    for (const p of products) {
        try {
            await pgClient.query(`INSERT INTO "Product" (id, "categoryId", name, description, price, image, stock, available, "createdAt", "updatedAt") 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, to_timestamp($9 / 1000.0), to_timestamp($10 / 1000.0)) ON CONFLICT (id) DO NOTHING`, 
            [p.id, p.categoryId, p.name, p.description, p.price, p.image, p.stock, p.available === 1, p.createdAt, p.updatedAt]);
        } catch(e) { console.error("Error product:", e.message) }
    }

    console.log("Migration completed!");
    pgClient.end();
    sqliteDb.close();
}

migrate().catch(console.error);
