const express = require("express");
const router = express.Router();

const sessionCtrl = require("../controllers/session");

const auth = require("../middleware/auth"); // Request authentification
const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * Create a new session
router.post("/create", admin, sessionCtrl.createSession); //!  admin

//* See all sessions
router.get("/getallsessions", auth, sessionCtrl.getAllSessions); //!  auth

//* Delete a session
router.delete("/delete/:sessionid", admin, sessionCtrl.delete); //! Admin

//* Delete sessions if past dates
router.delete("/deletepastdates", sessionCtrl.deletePastDates);

module.exports = router;
