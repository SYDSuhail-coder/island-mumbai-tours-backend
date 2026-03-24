const express = require('express');
const bodyParser = require('body-parser');
const NodeCache = require('node-cache');
require('@config/mongo');
const cors = require('cors');
const multer = require('multer');
require("dotenv").config({ quiet: true });

class Server {
  constructor() {
    this.app = express();
    this.setup();
  }

  setup = () => {
    global.CACHE = new NodeCache();

    this.app.use(cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: '*'
    }));

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    const multerId = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 100 * 1024 * 1024,
      },
    });

    this.app.use(multerId.fields([{ name: 'files', maxCount: 10 }]));

    const router = require('@routes/route');
    this.app.use('/', router);
  }

  run = (port) => {
    this.app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  }
}

module.exports = Server;
