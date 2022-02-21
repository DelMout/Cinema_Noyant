const express = require("express");
const router = express.Router();

// const cors = require("cors");
// const corsOptions = {
// 	origin: "http://localhost:8080/email_abonnes",
// 	optionsSuccessStatus: 200,
// };
// const multer = require("../middleware/multer-config.js"); //Upload files
const multer = require("multer");
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "images");
	},
	filename: (req, file, cb) => {
		console.log(file);
		cb(null, file.originalname);
	},
});
const upload = multer({ storage: storage });

// const upload = multer({
// 	dest: __dirname + "/images/",
// });

const subCtrl = require("../controllers/subscriber");

// * Create a subscriber
router.post("/create", subCtrl.createSubscriber); //! Rmettre admin

// * Get all subscribers
router.get("/getallsubs", subCtrl.getAllSubs); //! Rmettre admin

// * send email to all subscribers
router.post("/sendemail", subCtrl.sendEmail); //! Admin

// * save file
router.post("/saveimage", subCtrl.saveImage); //! Admin

module.exports = router;
