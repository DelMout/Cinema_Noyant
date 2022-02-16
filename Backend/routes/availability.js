const express = require("express");
const router = express.Router();

const availabilityCtrl = require("../controllers/availability");

// * Create a new record of availability
router.post("/create/:volunteerid/:sessionid", availabilityCtrl.createAvailable); //! Rmettre auth

// * Modify the record of availability from a volunteer
router.put("/volunteermodify/:availabilityid/:available", availabilityCtrl.updateAvailable); //! Rmettre auth

// * Modify the record of availability from administrator
router.put("/adminmodify/:availabilityid/:available", availabilityCtrl.confirmAvailable); //! Rmettre admin

// * Get availability from volunteer according to volunteerId and sessionId
router.get("/getavailable/:volunteerid/:sessionid", availabilityCtrl.seeAvailable); //! Rmettre auth

// * Get total of volunteers by session for Technique et for Accueil
router.get("/gettotalvolunteers/:sessionid/:available", availabilityCtrl.seeTotalVolunteers); //! Rmettre auth

module.exports = router;
