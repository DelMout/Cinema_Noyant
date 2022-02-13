const express = require("express");
const router = express.Router();

const availabilityCtrl = require("../controllers/availability");

// * Create a new record of availability
router.post("/create/:volunteerid/:sessionid/:available", availabilityCtrl.createAvailable); //! Rmettre auth

// * Modify the record of availability from a volunteer
router.put("/volunteermodify/:availabilityid/:available", availabilityCtrl.updateAvailable); //! Rmettre auth

// * Modify the record of availability from administrator
router.put("/adminmodify/:availabilityid/:available", availabilityCtrl.confirmAvailable); //! Rmettre admin

module.exports = router;
