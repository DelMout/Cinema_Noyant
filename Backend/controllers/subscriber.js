const { subscriber } = require("../models");
const nodemailer = require("nodemailer");
const path = require("path");
const fse = require("fs-extra");

//* Create a new subscriber
exports.createSubscriber = (req, res) => {
	const newSub = new subscriber({
		...req.body,
	});
	newSub
		.save()
		.then((sub) => {
			res.send(sub);
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};

// * Get all subscribers
exports.getAllSubs = (req, res) => {
	subscriber.findAll({}).then((obj) => {
		res.send(obj);
	});
};

// * Send an email to all subscribers
exports.sendEmail = (req, res) => {
	let transporter = nodemailer.createTransport({
		host: "source.o2switch.net",
		port: 465,
		secure: true, // true for 465, false for other ports
		tls: {
			rejectUnauthorized: false,
		},
		auth: {
			user: process.env.FROM_EMAIL,
			pass: process.env.PASS_EMAIL,
		},
	});

	// List of subscribers
	subscriber
		.findAndCountAll()
		.then((subscribers) => {
			// const affiche = affiche.jpg;

			const count = subscribers.count;
			for (let i = 0; i < count; i++) {
				// Message for each subscriber
				transporter.sendMail(
					{
						from: "Cinéma Noyant <cinema-noyant@delmout.com>",
						to: subscribers.rows[i].email,
						subject: "[Cinéma Noyant] " + req.body.title,
						html:
							req.body.content +
							// "<br/><br/><p>Merci de ne pas répondre à cet email</p><p>L'équipe Cinéma Noyant<br/>Familles Rurales</p>",
							"<img style='width:250px;margin-top:10px' src='cid:affiche@cinema.com'/><br/><br/><p>Merci de ne pas répondre à cet email</p><p>L'équipe Cinéma Noyant<br/>Familles Rurales</p>",
						attachments: [
							{
								filename: req.body.filename,
								path: path.join(__dirname, "../images/" + req.body.filename),
								cid: "affiche@cinema.com",
								contentDisposition: "inline",
							},
						],
					},
					(error, info) => {
						//! A revoir ci-dessous qd on sera en https
						if (error) {
							console.log(error);
							// res.status(401).send(error);
							// return;
						} else {
							res.status(200).send("email envoyé à tous !");
							// return;
							// console.log("ca marche !");
						}
					}
				);
			}
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};

//* Save an image
exports.saveImage = (req, res) => {
	console.log(req.body.image);
	fse.copySync(
		"E:/PROJET NUM 2020/Cinema_Noyant/Affiches/" + req.body.image,
		"./images/" + req.body.image
	);
	res.status(200).send("image uploaded !!");
};
