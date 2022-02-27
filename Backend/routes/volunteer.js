const express = require("express");
const router = express.Router();

const volunteerCtrl = require("../controllers/volunteer");

const auth = require("../middleware/auth"); // Request authentification
const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * Create a volunteer
router.post("/create", admin, volunteerCtrl.createVolunteer); //!  admin

// * Get all volunteers
router.get("/getallvolunteers", auth, volunteerCtrl.getAllVolunteers); //!  auth

// * Login for a volunteer
router.post("/login", volunteerCtrl.login);

// * Modify password after lost
router.put("/password/:jeton", volunteerCtrl.updatePassword);

// * Update jeton (used for forgotten password)
router.put("/newjeton/:email", auth, volunteerCtrl.newjeton); // auth

//* Find volunteer from his jeton
router.get("/fromjeton/:jeton", volunteerCtrl.jeton);

// * send email for updating password
router.post("/emailpassword/:email", volunteerCtrl.emailPassword);

// * send email to all volunteers
router.post("/emailinfo", admin, volunteerCtrl.emailInfo); //! Admin

module.exports = router;
