const mongoose = require('mongoose');
// import { MongoMemoryServer } from 'mongodb-memory-server';
const User = require('./user.model');
const Exercise = require('./exercise.model');

const connectDb = (databaseUrl = '') => {
  const url = databaseUrl || process.env.DATABASE_URL;
  console.log('🚀 ~ file: index.js ~ line 7 ~ connectDb ~ url', url);
  // console.log('DATABASE URL: ', url);
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const closetDB = async () => {
  // await mongoose.disconnect();
  await mongoose.connection.close();
};

const models = { User, Exercise };

module.exports = { models, connectDb, closetDB };
