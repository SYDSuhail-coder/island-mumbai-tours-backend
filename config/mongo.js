require('dotenv').config();
const mongoose = require('mongoose');

let ip = "127.0.0.1";
// let dbUrl = `mongodb://${ip}:27017/mumbail-Island`;
let dbUrl = process.env.MONGODB_URI || `mongodb://${ip}:27017/mumbail-Island`;

mongoose.connect(dbUrl).then(() => {
  console.log('connection successful');
  require('@model/addLanguage');
  require('@model/currency');
  require('@model/adminLogin')

}).catch((err) => {
  console.log('no connection', err);
});