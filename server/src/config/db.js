import mongoose from 'mongoose';

export async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
      throw new Error('MONGO_URI environment variable is not set');
    }

    // Mongoose connection options optimized for MongoDB Atlas
    const options = {
      // Connection pool settings for Atlas
      maxPoolSize: 10,
      minPoolSize: 2,
      
      // Timeout settings
      serverSelectionTimeoutMS: 5000, // Fail fast if can't connect
      socketTimeoutMS: 45000,
      
      // Retry settings
      retryWrites: true,
      retryReads: true,
      
      // Other settings
      w: 'majority',
    };

    // Set Mongoose options
    mongoose.set('strictQuery', true);
    
    // Connect to MongoDB Atlas
    console.log('🔗 Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, options);
    
    console.log('✅ MongoDB Atlas connected successfully');
    console.log(`📦 Database: ${mongoose.connection.name}`);
    console.log(`🌍 Host: ${mongoose.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
    
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB Atlas:');
    console.error('Error:', error.message);
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('🚨 Network error: Check your internet connection');
    } else if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication error: Check your username and password in MONGO_URI');
    } else if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.error('🚫 IP not whitelisted: Add 0.0.0.0/0 to Atlas Network Access');
      console.error('   → Go to: https://cloud.mongodb.com/v2/network-access');
    }
    
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('👋 MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});
