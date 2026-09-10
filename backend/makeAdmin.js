import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await User.updateMany({}, { role: 'ADMIN' });
  console.log('All users made ADMIN');
  process.exit();
});
