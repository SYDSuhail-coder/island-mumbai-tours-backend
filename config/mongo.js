const mongoose = require('mongoose');

let ip = "127.0.0.1";
let dbUrl = `mongodb://${ip}:27017/skilsCreate`;

mongoose.connect(dbUrl).then(() => {
  console.log('connection successful');
  // require('@model/demoPage');
}).catch((err) => {
  console.log('no connection', err);
});
