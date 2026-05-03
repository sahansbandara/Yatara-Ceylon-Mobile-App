const mongoose = require('mongoose');

function assertSafeMobileDatabase(connection) {
  const requireMobileDb = process.env.REQUIRE_MOBILE_DB !== 'false';
  if (!requireMobileDb) return;

  const expectedDb = process.env.MOBILE_DB_NAME || 'yatara-mobile';
  const actualDb = connection.db?.databaseName;

  if (actualDb !== expectedDb) {
    throw new Error(
      `Refusing to use MongoDB database "${actualDb}". Mobile backend is locked to "${expectedDb}". ` +
      'Set MONGODB_URI to the mobile database or set REQUIRE_MOBILE_DB=false only if you understand the risk.'
    );
  }
}

async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is required');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  assertSafeMobileDatabase(mongoose.connection);
  console.log(`MongoDB connected to ${mongoose.connection.db.databaseName}`);
  return mongoose.connection;
}

module.exports = connectDB;
