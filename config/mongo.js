// require('dotenv').config();
// const mongoose = require('mongoose');

// let ip = "127.0.0.1";
// // let dbUrl = `mongodb://${ip}:27017/mumbail-Island`;
// let dbUrl = process.env.MONGODB_URI || `mongodb://${ip}:27017/mumbail-Island`;

// mongoose.connect(dbUrl).then(() => {
//   console.log('connection successful');
//   require('@model/addLanguage');
//   require('@model/currency');
//   require('@model/adminLogin');
//   require('@model/roles');

// }).catch((err) => {
//   console.log('no connection', err);
// });

require('dotenv').config();
const mongoose = require('mongoose');

const isProduction = process.env.NODE_ENV === 'production';

const localDb = 'mongodb://127.0.0.1:27017/mumbail-Island';
const liveDb = process.env.MONGODB_URI;

const dbUrl = isProduction ? liveDb : localDb;

console.log(`Running in ${isProduction ? 'PRODUCTION' : 'LOCAL'} mode`);
console.log(`Connecting to: ${dbUrl}`);

mongoose.connect(dbUrl).then(() => {
  console.log('connection successful');
  require('@model/addLanguage');
  require('@model/currency');
  require('@model/adminLogin');
  require('@model/roles');
}).catch((err) => {
  console.log('no connection', err);
});