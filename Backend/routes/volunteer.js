const express = require("express");
const router = express.Router();

const volunteerCtrl = require("../controllers/volunteer");

// * Create a volunteer
router.post("/create", volunteerCtrl.createVolunteer); //! Rmettre admin

// * Get all volunteers
router.get("/getallvolunteers", volunteerCtrl.getAllVolunteers); //! Rmettre admin

// * Login for a volunteer
router.post("/login", volunteerCtrl.login);

// * Modify password after lost
router.put("/password/:jeton", volunteerCtrl.updatePassword);

// * Update jeton (used for forgotten password)
router.put("/newjeton/:email", volunteerCtrl.newjeton); //! auth

//* Find volunteer from his jeton
router.get("/fromjeton/:jeton", volunteerCtrl.jeton);

// * send email for updating password
router.post("/emailpassword/:email", volunteerCtrl.emailPassword);

// * send email to all volunteers
router.post("/emailinfo", volunteerCtrl.emailInfo); //! Admin

module.exports = router;
