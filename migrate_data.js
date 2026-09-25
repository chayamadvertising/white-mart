const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const dbPath = path.resolve('../ecommerce/db.sqlite3');
const db = new sqlite3.Database(dbPath);

async function seed() {
  console.log("Reading data from old database...");
  
  const categories = await new Promise((resolve, reject) => {
    db.all("SELECT * FROM shop_category", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

  const products = await new Promise((resolve, reject) => {
    db.all("SELECT * FROM shop_product", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

  console.log(`Found ${categories.length} categories and ${products.length} products. Migrating...`);

  // We will map old string/integer IDs to Next.js cuid() using Prisma,
  // but to maintain relationships, we can just use the string version of the old integer ID.

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id.toString() },
      update: {},
      create: {
        id: cat.id.toString(),
        name: cat.name,
      }
    });
  }

  for (const prod of products) {
    let imageUrl = prod.image;
    // Strip "products/" prefix if it exists, since we check for "/products/" in UI, but the NextJS UI prepends it
    if (imageUrl && imageUrl.startsWith('products/')) {
      imageUrl = imageUrl.replace('products/', '');
    }

    await prisma.product.upsert({
      where: { id: prod.id.toString() },
      update: {},
      create: {
        id: prod.id.toString(),
        categoryId: prod.category_id.toString(),
        name: prod.name,
        description: prod.description,
        price: prod.price,
        image: imageUrl,
        stock: prod.stock,
        available: prod.available === 1,
      }
    });
  }

  console.log("Database seeded successfully!");
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    db.close();
  });
