import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/interview_ace_ai';
    
    // Set short timeout bounds to prevent server blocking when offline
    const options = {
      serverSelectionTimeoutMS: 2000, 
    };

    mongoose.set('bufferCommands', false); // disable buffering so offline errors throw instantly

    const conn = await mongoose.connect(mongoURI, options);
    console.log(`MongoDB Database connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB Daemon offline (${error.message}). Running server routes in crash-free Mock Memory mode.`);
  }
};

export default connectDB;
