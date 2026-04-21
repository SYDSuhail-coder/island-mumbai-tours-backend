const express = require('express');
const router = express.Router();
const V1Controller = require('@routes/v1/controller');
const v1Controller = new V1Controller();
router.route("/service/health").get(v1Controller.health);

//AdminLogin
router.route("/service/createAdminLogin").post(v1Controller.createAdminLogin)


// currency route 
router.route("/service/currency/get").get(v1Controller.getCurrencyRates);
router.route("/service/currency/convert").get(v1Controller.convertCurrency);
router.route("/service/currency/save").post(v1Controller.saveCurrencyRates);
router.route("/service/currency/db").get(v1Controller.getRates);

module.exports = router;