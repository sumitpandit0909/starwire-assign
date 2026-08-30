import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB(): Promise<typeof mongoose | null> {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/starwire_db';
  
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error: any) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${mongoUri}:`, error.message);
    console.warn(`[MongoDB Info] The server will run, but database features require a running MongoDB instance.`);
    return null;
  }
}
