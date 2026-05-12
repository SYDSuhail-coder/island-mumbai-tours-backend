const express = require('express');
const router = express.Router();
const V1Controller = require('@routes/v1/controller');
const v1Controller = new V1Controller();
const apiKeyMiddleware = require('../../middleware/apiKey'); //  import karo
router.use(apiKeyMiddleware); //saare routes pe apply hoga

router.route("/service/health").get(v1Controller.health);

//AdminLogin
router.route("/service/createAdminLogin").post(v1Controller.createAdminLogin);
router.route("/service/getAdminLogin").post(v1Controller.getAdminLogin);
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

// ToursSection
router.route("/service/ToursSection").post(v1Controller.createToursSection);
router.route("/service/getTouresSectionAll").get(v1Controller.getTouresSectionAll);
router.route("/service/getTouresSectionById/:slug").get(v1Controller.getTouresSectionById);
router.route("/service/deleteTouresSectionById/:slug").delete(v1Controller.deleteTouresSectionById);
router.route("/service/updateToursSectionById/:slug").put(v1Controller.updateToursSectionById);

// MumbaiPrivateTour
router.route("/service/createMumbaiPrivateTour").post(v1Controller.createMumbaiPrivateTour);
router.route("/service/getMumbaiPrivateTourAll").get(v1Controller.getMumbaiPrivateTourAll);
router.route("/service/getMumbaiPrivateTourById/:slug").get(v1Controller.getMumbaiPrivateTourById);
router.route("/service/deleteMumbaiPrivateTourById/:slug").delete(v1Controller.deleteMumbaiPrivateTourById);
router.route("/service/updateMumbaiPrivateTourById/:slug").put(v1Controller.updateMumbaiPrivateTourById);

// MumbaiWallingTour
router.route("/service/createMumbaiWalkingTour").post(v1Controller.createMumbaiWalkingTour);
router.route("/service/getMumbaiWalkingTourAll").get(v1Controller.getMumbaiWalkingTourAll);
router.route("/service/getMumbaiWalkingTourById/:slug").get(v1Controller.getMumbaiWalkingTourById);
router.route("/service/deleteMumbaiWalkingTourById/:slug").delete(v1Controller.deleteMumbaiWalkingTourById);
router.route("/service/updateMumbaiWalkingTourById/:slug").put(v1Controller.updateMumbaiWalkingTourById);

module.exports = router;