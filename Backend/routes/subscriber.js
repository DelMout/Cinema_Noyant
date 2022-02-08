const express = require("express");
const router = express.Router();

const subCtrl = require("../controllers/subscriber");

// const auth = require("../middleware/auth"); // Request authentification
// const ident = require("../middleware/ident"); // Request identification (connectedId = Req.params.id)
// const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * Create a new subscriber
router.post("/createanew", subCtrl.create);

module.exports = router;
