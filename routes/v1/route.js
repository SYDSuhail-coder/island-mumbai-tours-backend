const express = require('express');
const router = express.Router();
const V1Controller = require('@routes/v1/controller');
const v1Controller = new V1Controller();

module.exports = router;