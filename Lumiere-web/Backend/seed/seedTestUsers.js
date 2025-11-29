// seed/seedTestUsers.js
// Creates test users for different roles

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../src/config/db.js';
import User from '../src/models/User.js';
import SignupKey from '../src/models/SignupKey.js';

dotenv.config();

async function seedTestUsers() {
  try {
    await connectDB();
    
    // Wait for connection to be ready
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => {
        mongoose.connection.once('connected', resolve);
      });
    }
    
    console.log('Connected to database');

    // Get admin for creating signup keys if needed
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('❌ Admin user not found. Run npm run seed:admin first!');
      process.exit(1);
    }

    // Create test users
    const testUsers = [
      {
        email: 'pastry@lumiere.com',
        password: 'pastry123',
        firstName: 'Marie',
        lastName: 'Chef',
        role: 'pastry_chef',
      },
      {
        email: 'barista@lumiere.com',
        password: 'barista123',
        firstName: 'John',
        lastName: 'Barista',
        role: 'barista',
      },
    ];

    for (const userData of testUsers) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        console.log(`⚠️  User already exists: ${userData.email}`);
      } else {
        const user = await User.create(userData);
        console.log(`✅ Created ${userData.role}: ${userData.email} (password: ${userData.password})`);
      }
    }

    console.log('\n═══════════════════════════════════════');
    console.log('TEST USERS CREATED');
    console.log('═══════════════════════════════════════');
    console.log('\nPastry Chef:');
    console.log('  Email: pastry@lumiere.com');
    console.log('  Password: pastry123');
    console.log('\nBarista:');
    console.log('  Email: barista@lumiere.com');
    console.log('  Password: barista123');
    console.log('\nAdmin:');
    console.log('  Email: admin@lumiere.com');
    console.log('  Password: admin123');
    console.log('\n═══════════════════════════════════════\n');

  } catch (err) {
    console.error('Error seeding test users:', err);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

seedTestUsers();

