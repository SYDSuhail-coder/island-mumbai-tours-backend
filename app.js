require('module-alias/register');

const Server = require('./config/server');

const server = new Server();

const PORT = process.env.PORT || 1001;
server.run(PORT);