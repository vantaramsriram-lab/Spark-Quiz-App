const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/quizapp');
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: 'sriramvantaram@gmail.com' });
    if (existingAdmin) {
      console.log('Admin already exists!');
      console.log('Email: sriramvantaram@gmail.com');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Sriram@2008', 10);

    await User.create({
      name: 'Sriram',
      email: 'sriramvantaram@gmail.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin created successfully!');
    console.log('Email: sriramvantaram@gmail.com');
    console.log('Password: Sriram@2008');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
