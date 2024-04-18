const mongoose = require('mongoose');
const userModel = require('./model/user');
require('dotenv').config()

mongoose.connect(process.env.DB_URL)


const sampleUsers = [
  {
    userName: 'developer1',
    email: 'developer1@gmail.com',
    password: 'developer1234',
    role: 'DEVELOPER',
  },
  {
    userName: 'hr',
    email: 'hr@gmail.com',
    password: 'hr1234',
    role: 'HR',
  },
  {
    userName: 'admin',
    email: 'admin@gmail.com',
    password: 'admin1234',
    role: 'ADMIN',
  },
];


async function seedData() {
  try {
    
    await userModel.deleteMany();
    for (const user of sampleUsers) {
      const { email } = user;
      const existingUser = await userModel.findOne({ email });

      if (!existingUser) {
        await userModel.create(user);
      } else {
        console.log(`User with email ${email} already exists. Skipping insertion.`);
      }
    }

    console.log('Data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
   
    mongoose.disconnect();
  }
}


seedData();
