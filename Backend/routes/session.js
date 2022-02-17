const express = require("express");
const router = express.Router();

const sessionCtrl = require("../controllers/session");

// * Create a new session
router.post("/create", sessionCtrl.createSession); //! Rmettre admin

//* See all sessions
router.get("/getallsessions", sessionCtrl.getAllSessions); //! Rmettre admin

//* Delete a session
router.delete("/delete/:sessionid", sessionCtrl.delete); //! Admin

//* Delete sessions if past dates
router.delete("/deletepastdates", sessionCtrl.deletePastDates); //! auth

module.exports = router;
