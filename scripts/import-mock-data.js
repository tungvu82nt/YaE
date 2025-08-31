#!/usr/bin/env node

// ===========================================
// Import Mock Data to MySQL Database
// ===========================================

import pool from '../src/lib/database.js';
import { products, categories } from '../src/data/mockData.js';

async function importMockData() {
  try {
    console.log('🚀 Starting mock data import...\n');

    // Import categories first
    console.log('📁 Importing categories...');
    for (const category of categories) {
      try {
        await pool.execute(
          'INSERT INTO categories (name, slug, icon, sort_order) VALUES (?, ?, ?, ?)',
          [category.name, category.slug, category.icon, categories.indexOf(category) + 1]
        );
        console.log(`   ✅ ${category.name}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`   ⚠️  ${category.name} already exists`);
        } else {
          console.error(`   ❌ Error importing ${category.name}:`, error.message);
        }
      }
    }

    // Get category ID mapping
    const [categoryRows] = await pool.execute('SELECT id, slug FROM categories');
    const categoryMap = {};
    categoryRows.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });

    // Import products
    console.log('\n📦 Importing products...');
    for (const product of products) {
      try {
        const categoryId = categoryMap[product.category];

        await pool.execute(
          `INSERT INTO products
           (name, slug, description, price, original_price, category_id, brand,
            stock_quantity, sold_count, rating, review_count, images, specifications, tags)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            product.name,
            product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            product.description,
            product.price,
            product.originalPrice || null,
            categoryId,
            product.brand,
            product.stock,
            product.sold,
            product.rating,
            product.reviewCount,
            JSON.stringify(product.images),
            JSON.stringify(product.specifications || {}),
            JSON.stringify(product.tags || [])
          ]
        );
        console.log(`   ✅ ${product.name}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`   ⚠️  ${product.name} already exists`);
        } else {
          console.error(`   ❌ Error importing ${product.name}:`, error.message);
        }
      }
    }

    // Verify import
    const [productCount] = await pool.execute('SELECT COUNT(*) as count FROM products');
    const [categoryCount] = await pool.execute('SELECT COUNT(*) as count FROM categories');

    console.log('\n📊 Import Summary:');
    console.log(`   📁 Categories: ${categoryCount[0].count}`);
    console.log(`   📦 Products: ${productCount[0].count}`);

    console.log('\n🎉 Mock data import completed successfully!');

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run import
importMockData();
