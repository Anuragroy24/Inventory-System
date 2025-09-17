const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/Product');
const Category = require('./models/Category');

const categoriesData = [
  { name: 'Electronics', description: 'Electronic gadgets and devices' },
  { name: 'Books', description: 'Books and literature' },
  { name: 'Clothing', description: 'Apparel and accessories' }
];

const productsData = [
  { name: 'Smartphone', sku: 'ELEC-001', price: 699, stock_quantity: 15, category: 'Electronics' },
  { name: 'Laptop', sku: 'ELEC-002', price: 1200, stock_quantity: 8, category: 'Electronics' },
  { name: 'Headphones', sku: 'ELEC-003', price: 99, stock_quantity: 5, category: 'Electronics' },
  { name: 'Novel', sku: 'BOOK-001', price: 15, stock_quantity: 20, category: 'Books' },
  { name: 'Notebook', sku: 'BOOK-002', price: 5, stock_quantity: 50, category: 'Books' },
  { name: 'T-shirt', sku: 'CLOTH-001', price: 20, stock_quantity: 9, category: 'Clothing' },
  { name: 'Jeans', sku: 'CLOTH-002', price: 40, stock_quantity: 12, category: 'Clothing' },
  { name: 'Jacket', sku: 'CLOTH-003', price: 60, stock_quantity: 3, category: 'Clothing' },
  { name: 'Tablet', sku: 'ELEC-004', price: 350, stock_quantity: 7, category: 'Electronics' },
  { name: 'E-reader', sku: 'ELEC-005', price: 120, stock_quantity: 2, category: 'Electronics' }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/inventory');
  console.log('Connected to MongoDB');

  // Clear existing data
  await Product.deleteMany({});
  await Category.deleteMany({});

  // Insert categories
  const categories = await Category.insertMany(categoriesData);
  const categoryMap = {};
  categories.forEach(cat => { categoryMap[cat.name] = cat._id; });

  // Insert products with correct category_id
  const productsToInsert = productsData.map(prod => ({
    ...prod,
    category_id: categoryMap[prod.category],
    category: undefined // remove the string category
  }));
  await Product.insertMany(productsToInsert);

  console.log('Seed data inserted!');
  mongoose.disconnect();
}

seed().catch(err => { console.error(err); mongoose.disconnect(); });
