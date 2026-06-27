/**
 * LIDA FASHION WEAR — Database Seed Script
 * Run with: npm run seed
 * Seeds: 6 categories, 6 jersey products, 1 admin account
 */

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const dotenv   = require('dotenv');
const path     = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Category = require('../models/Category');
const Product  = require('../models/Product');
const Admin    = require('../models/Admin');

// ─── Seed Data ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: 'Jerseys',           description: 'Premium football and sports jerseys — our bestselling category', isFeatured: true, displayOrder: 1 },
  { name: 'T-Shirts',          description: 'Casual and statement tees for everyday wear',                   isFeatured: false, displayOrder: 2 },
  { name: 'Hoodies',           description: 'Warm, stylish hoodies for every season',                       isFeatured: false, displayOrder: 3 },
  { name: 'Jackets',           description: 'Premium jackets and outerwear',                                isFeatured: false, displayOrder: 4 },
  { name: 'Shorts',            description: 'Comfortable shorts for sport and leisure',                     isFeatured: false, displayOrder: 5 },
  { name: 'Caps & Accessories',description: 'Hats, caps, and fashion accessories',                          isFeatured: false, displayOrder: 6 },
];

const JERSEY_PRODUCTS = (jerseyId) => [
  {
    name: 'Classic Black Jersey',
    description: 'A timeless all-black jersey crafted from breathable performance fabric. Perfect for the pitch or the streets. Features moisture-wicking technology and a slim-fit cut that flatters every body type.',
    category:     jerseyId,
    price:        2500,
    sizes:        ['S', 'M', 'L', 'XL', 'XXL'],
    colors:       ['Black', 'White'],
    images:       [],
    stock:        50,
    isFeatured:   true,
    isBestseller: true,
  },
  {
    name: 'Gold Edition Jersey',
    description: 'Our signature LIDA Gold Edition jersey — a statement piece that commands attention. Luxurious gold-trimmed design with embroidered LIDA branding. Limited-edition colourway.',
    category:     jerseyId,
    price:        3200,
    sizes:        ['S', 'M', 'L', 'XL'],
    colors:       ['Black/Gold', 'White/Gold'],
    images:       [],
    stock:        30,
    isFeatured:   true,
    isBestseller: true,
  },
  {
    name: 'Home Kit Jersey',
    description: 'Classic home kit jersey with clean lines and bold team colours. Made from premium breathable polyester with mesh ventilation panels for maximum comfort during play.',
    category:     jerseyId,
    price:        2800,
    sizes:        ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors:       ['Blue', 'Red', 'White'],
    images:       [],
    stock:        40,
    isFeatured:   false,
    isBestseller: true,
  },
  {
    name: 'Away Kit Jersey',
    description: 'Sleek away kit jersey designed for style and performance. Lightweight fabric with 4-way stretch technology. Perfect contrast colourway for the away fixture.',
    category:     jerseyId,
    price:        2800,
    sizes:        ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors:       ['White', 'Yellow', 'Grey'],
    images:       [],
    stock:        35,
    isFeatured:   false,
    isBestseller: true,
  },
  {
    name: 'Premium Training Jersey',
    description: 'Built for champions. Our Premium Training Jersey features ultra-light DryTech fabric, reflective details for night training, and reinforced stitching at stress points.',
    category:     jerseyId,
    price:        1800,
    sizes:        ['S', 'M', 'L', 'XL', 'XXL'],
    colors:       ['Black', 'Navy', 'Green'],
    images:       [],
    stock:        60,
    isFeatured:   false,
    isBestseller: false,
  },
  {
    name: 'Limited Edition Lida Jersey',
    description: 'The crown jewel of our collection. The Limited Edition LIDA Jersey is a collector\'s masterpiece — featuring hand-finished details, jacquard weave branding, and a certificate of authenticity. Only 100 made.',
    category:     jerseyId,
    price:        4500,
    sizes:        ['S', 'M', 'L', 'XL'],
    colors:       ['Black/Gold', 'Burgundy/Gold'],
    images:       [],
    stock:        15,
    isFeatured:   true,
    isBestseller: true,
  },
];

const ADMIN_ACCOUNT = {
  fullName: 'LIDA Admin',
  email:    'admin@lidafashion.com',
  password: 'Admin@1234',
  role:     'admin',
};

// ─── Seed Function ────────────────────────────────────────────────────────────

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('\n✅ Connected to MongoDB');
    console.log('🌱 Starting seed process...\n');

    // ── Categories ────────────────────────────────────────────────────────────
    console.log('📂 Seeding categories...');
    const existingCats = await Category.countDocuments();
    if (existingCats > 0) {
      console.log('   ⚠️  Categories already exist — skipping');
    } else {
      const cats = await Category.insertMany(CATEGORIES);
      console.log(`   ✅ Created ${cats.length} categories`);
    }

    // ── Jersey Products ───────────────────────────────────────────────────────
    console.log('\n👕 Seeding jersey products...');
    const jerseyCategory = await Category.findOne({ name: 'Jerseys' });
    const existingProds  = await Product.countDocuments();

    if (existingProds > 0) {
      console.log('   ⚠️  Products already exist — skipping');
    } else if (!jerseyCategory) {
      console.log('   ❌ Jerseys category not found — cannot seed products');
    } else {
      const prods = await Product.insertMany(JERSEY_PRODUCTS(jerseyCategory._id));
      console.log(`   ✅ Created ${prods.length} jersey products`);
    }

    // ── Admin Account ─────────────────────────────────────────────────────────
    console.log('\n👤 Seeding admin account...');
    const existingAdmin = await Admin.findOne({ email: ADMIN_ACCOUNT.email });
    if (existingAdmin) {
      console.log('   ⚠️  Admin account already exists — skipping');
    } else {
      const admin = await Admin.create(ADMIN_ACCOUNT);
      console.log(`   ✅ Admin created: ${admin.email}`);
    }

    // ── Summary ───────────────────────────────────────────────────────────────
    console.log('\n' + '═'.repeat(50));
    console.log('🎉 SEED COMPLETE!\n');
    console.log('Admin Login:');
    console.log(`  Email:    ${ADMIN_ACCOUNT.email}`);
    console.log(`  Password: ${ADMIN_ACCOUNT.password}`);
    console.log('\nAdmin Panel: http://localhost:5173/admin/login');
    console.log('Storefront:  http://localhost:5173');
    console.log('═'.repeat(50) + '\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
