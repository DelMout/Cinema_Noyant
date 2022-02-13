const express = require("express");
const router = express.Router();

const subCtrl = require("../controllers/subscriber");

// * Create a subscriber
router.post("/create", subCtrl.createSubscriber); //! Rmettre admin

// * Get all subscribers
router.get("/getallsubs", subCtrl.getAllSubs); //! Rmettre admin

// * send email to all subscribers
router.post("/sendemail", subCtrl.sendEmail); //! Admin

module.exports = router;
