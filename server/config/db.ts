import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/solana-reflex';
const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000;

const connectDB = async (retryCount = 0): Promise<typeof mongoose> => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    mongoose.connection.on('error', (err: Error) => {
      console.error('MongoDB connection error:', err);
      reconnect();
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
      reconnect();
    });

    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${(error as Error).message}`);
    
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying connection... Attempt ${retryCount + 1}/${MAX_RETRIES}`);
      await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
      return connectDB(retryCount + 1);
    } else {
      console.error('Max retry attempts reached. Exiting...');
      process.exit(1);
    }
  }
};

const reconnect = (): void => {
  console.log('Attempting to reconnect to MongoDB...');
  connectDB();
};

export default connectDB;