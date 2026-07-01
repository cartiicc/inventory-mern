import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

dotenv.config();

const run = async () => {
  await connectDB();

  console.log('🌱 Seeding database...');

  await User.deleteMany();
  await Product.deleteMany();

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@inventory.com',
    password: 'admin123',
    role: 'admin',
  });

  await User.create({
    name: 'Staff Member',
    email: 'staff@inventory.com',
    password: 'staff123',
    role: 'staff',
  });

  const sampleProducts = [
    { name: 'Wireless Mouse', category: 'Electronics', sku: 'WM-001', buyingPrice: 8, sellingPrice: 19.99, quantity: 120, supplier: 'TechSource Ltd' },
    { name: 'Mechanical Keyboard', category: 'Electronics', sku: 'MK-002', buyingPrice: 35, sellingPrice: 79.99, quantity: 4, supplier: 'TechSource Ltd' },
    { name: 'USB-C Cable 2m', category: 'Accessories', sku: 'UC-003', buyingPrice: 2, sellingPrice: 9.99, quantity: 0, supplier: 'CableWorks' },
    { name: 'Office Chair', category: 'Furniture', sku: 'OC-004', buyingPrice: 60, sellingPrice: 149.99, quantity: 25, supplier: 'ErgoFurnish' },
    { name: 'Standing Desk', category: 'Furniture', sku: 'SD-005', buyingPrice: 150, sellingPrice: 349.99, quantity: 8, supplier: 'ErgoFurnish' },
    { name: 'Notebook A5', category: 'Stationery', sku: 'NB-006', buyingPrice: 1, sellingPrice: 4.99, quantity: 300, supplier: 'PaperCo' },
  ];

  await Product.insertMany(sampleProducts.map((p) => ({ ...p, createdBy: admin._id })));

  console.log('✅ Seed complete:');
  console.log('   Admin login: admin@inventory.com / admin123');
  console.log('   Staff login: staff@inventory.com / staff123');
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
