const { subscriber } = require("../models");
const nodemailer = require("nodemailer");

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

	//! Copier une image de l'affiche de cinéma ?
	// List of subscribers
	subscriber
		.findAndCountAll()
		.then((subscribers) => {
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
							"<br/><br/><p>Merci de ne pas répondre à cet email</p><p>L'équipe Cinéma Noyant</p>",
					},
					(error, info) => {
						if (error) {
							return res.status(401).send(error);
						}
						res.status(200).send("email envoyé à tous !");
					}
				);
			}
		})
		.catch((err) => res.status(401).send(err));
};
