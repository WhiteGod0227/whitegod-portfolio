const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isMongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.log('⚡ [DB Notice] MONGO_URI not configured in .env.');
    console.log('⚡ [DB Notice] Operating with High-Reliability Local JSON Storage mode.');
    ensureDataDir();
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isMongoConnected = true;
    console.log(`🌌 [MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`⚠️ [MongoDB Warning] Connection error: ${error.message}`);
    console.log('⚡ [DB Fallback] Switching seamlessly to Local JSON Storage mode.');
    ensureDataDir();
    isMongoConnected = false;
    return false;
  }
};

const ensureDataDir = () => {
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const messagesFile = path.join(dataDir, 'messages.json');
  if (!fs.existsSync(messagesFile)) {
    fs.writeFileSync(messagesFile, JSON.stringify([], null, 2), 'utf-8');
  }
};

const getDBStatus = () => {
  return {
    connected: isMongoConnected,
    mode: isMongoConnected ? 'MongoDB' : 'Local JSON Storage',
  };
};

module.exports = {
  connectDB,
  getDBStatus,
  ensureDataDir,
};
