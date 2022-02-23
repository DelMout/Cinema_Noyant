const express = require("express");
const router = express.Router();

const availabilityCtrl = require("../controllers/availability");

const auth = require("../middleware/auth"); // Request authentification
const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * Create a new record of availability
router.post("/create/:volunteerid/:sessionid", auth, availabilityCtrl.createAvailable); //!  auth

// * Modify the record of availability from a volunteer
router.put("/volunteermodify/:availabilityid/:available", auth, availabilityCtrl.updateAvailable); //!  auth

// * Modify the record of availability from administrator
router.put("/adminmodify/:availabilityid/:available", admin, availabilityCtrl.confirmAvailable); //!  admin

// * Get availability from volunteer according to volunteerId and sessionId
router.get("/getavailable/:volunteerid/:sessionid", auth, availabilityCtrl.seeAvailable); //!  auth

// * Get total of volunteers by session for Technique et for Accueil
router.get("/gettotalvolunteers/:sessionid/:available", auth, availabilityCtrl.seeTotalVolunteers); //!  auth

module.exports = router;
