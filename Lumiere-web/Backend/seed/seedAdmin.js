// seed/seedAdmin.js
// Creates the initial admin user and signup keys

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../src/config/db.js';
import User from '../src/models/User.js';
import SignupKey from '../src/models/SignupKey.js';

dotenv.config();

async function seedAdmin() {
  try {
    await connectDB();
    
    // Wait for connection to be ready
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => {
        mongoose.connection.once('connected', resolve);
      });
    }
    
    console.log('Connected to database');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
    } else {
      // Create admin user
      const admin = await User.create({
        email: 'admin@lumiere.com',
        password: 'admin123', // CHANGE THIS IN PRODUCTION!
        firstName: 'Admin',
        lastName: 'Lumière',
        role: 'admin',
      });
      console.log('✅ Admin user created:', admin.email);
      console.log('   Password: admin123 (CHANGE THIS!)');
    }

    // Get admin for creating signup keys
    const admin = await User.findOne({ role: 'admin' });

    // Create default signup keys if they don't exist
    const pastryKey = await SignupKey.findOne({ role: 'pastry_chef' });
    if (!pastryKey) {
      await SignupKey.create({
        key: 'PASTRY2024',
        role: 'pastry_chef',
        description: 'Default signup key for pastry chefs',
        createdBy: admin._id,
      });
      console.log('✅ Pastry chef signup key created: PASTRY2024');
    } else {
      console.log('Pastry chef signup key already exists');
    }

    const baristaKey = await SignupKey.findOne({ role: 'barista' });
    if (!baristaKey) {
      await SignupKey.create({
        key: 'BARISTA2024',
        role: 'barista',
        description: 'Default signup key for baristas',
        createdBy: admin._id,
      });
      console.log('✅ Barista signup key created: BARISTA2024');
    } else {
      console.log('Barista signup key already exists');
    }

    console.log('\n═══════════════════════════════════════');
    console.log('SETUP COMPLETE');
    console.log('═══════════════════════════════════════');
    console.log('\nAdmin Login:');
    console.log('  Email: admin@lumiere.com');
    console.log('  Password: admin123');
    console.log('\nSignup Keys:');
    console.log('  Pastry Chef: PASTRY2024');
    console.log('  Barista: BARISTA2024');
    console.log('\n⚠️  Remember to change these in production!');
    console.log('═══════════════════════════════════════\n');

  } catch (err) {
    console.error('Error seeding admin:', err);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

seedAdmin();

