const { subscriber } = require("../models");
// const nodemailer = require("nodemailer");
// const path = require("path");

// * Create a new subscriber
exports.create = (req, res) => {
	const newSub = new subscriber({
		email: req.body.email,
		last_name: req.body.last_name,
		first_name: req.body.first_name,
	});
	newSub
		.save()
		.then((sub) => {
			res.status(200).send(sub);
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};
