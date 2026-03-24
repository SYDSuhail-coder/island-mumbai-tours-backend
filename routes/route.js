const express = require('express');
const v1Route = require('@routes/v1/route');


const router = express.Router();
router.use('/v1', v1Route);


module.exports = router;