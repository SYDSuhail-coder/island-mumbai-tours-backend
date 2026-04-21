const express = require('express');
const router = express.Router();
const V1Controller = require('@routes/v1/controller');
const v1Controller = new V1Controller();
router.route("/service/health").get(v1Controller.health);

//AdminLogin
router.route("/service/createAdminLogin").post(v1Controller.createAdminLogin);
router.route("/service/getAdminLogin").post(v1Controller.getAdminLogin); // FIX
router.route("/service/listAdminLogin").get(v1Controller.listAdminLogin);
router.route("/service/deleteAdminLoginById/:id").delete(v1Controller.deleteAdminLoginById);

//Roles
router.route("/service/roles").post(v1Controller.addRoles)
router.route("/service/roles/update/:id").put(v1Controller.updateRoles)
router.route("/service/roles/get").get(v1Controller.getRoles)

// currency route 
router.route("/service/currency/get").get(v1Controller.getCurrencyRates);
router.route("/service/currency/convert").get(v1Controller.convertCurrency);
router.route("/service/currency/save").post(v1Controller.saveCurrencyRates);
router.route("/service/currency/db").get(v1Controller.getRates);

module.exports = router;