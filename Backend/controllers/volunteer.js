const { volunteer } = require("../models");
const bcrypt = require("bcrypt"); // crypt password
const jwt = require("jsonwebtoken"); // create token key
const passwordValidator = require("password-validator");
const schemaPassword = new passwordValidator();
const nodemailer = require("nodemailer");

//* Schema Password
schemaPassword.is().min(8).has().uppercase().has().lowercase().has().digits();

//* Create a new volunteer
exports.createVolunteer = (req, res) => {
	if (!schemaPassword.validate(req.body.password)) {
		return res.status(401).send("password not enough strong");
	} else {
		const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let jeton = "";
		for (let i = 0; i < 25; i++) {
			jeton += characters[Math.floor(Math.random() * characters.length)];
		}
		const newVolunteer = new volunteer({
			...req.body,
			password: bcrypt.hashSync(req.body.password, 10),
			last_connect: Date(),
			jeton: jeton,
		});
		newVolunteer
			.save()
			.then((user) => {
				let token = jwt.sign(
					{ userId: user.id, isAdmin: user.isAdmin },
					process.env.JWT_KEY,
					{
						expiresIn: "1h",
					}
				);
				res.json({
					userId: user.id,
					token: token,
					isAdmin: user.isAdmin,
				});
			})
			.catch((err) => {
				res.status(401).send(err.errors[0].message);
			});
	}
};

// * Get all volunteers
exports.getAllVolunteers = (req, res) => {
	volunteer.findAll({}).then((obj) => {
		res.send(obj);
	});
};

// * Login
exports.login = (req, res) => {
	const email_saisi = req.body.email;
	const password_saisi = req.body.password;
	volunteer
		.findOne({ where: { email: email_saisi } })
		.then((volunteer) => {
			const password = volunteer.password;
			if (bcrypt.compareSync(password_saisi, password)) {
				let token = jwt.sign(
					{ volunteerId: volunteer.id, isAdmin: volunteer.isAdmin },
					process.env.JWT_KEY,
					{
						expiresIn: "1h",
					}
				);
				res.json({
					volunteerId: volunteer.id,
					token: token,
					isAdmin: volunteer.isAdmin,
				});
			} else {
				res.status(401).send("Password not OK");
			}
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};

// * Modif password
exports.updatePassword = (req, res) => {
	if (!schemaPassword.validate(req.body.password)) {
		return res.status(401).send(schemaPassword.validate(req.body.password, { list: true }));
	} else {
		volunteer
			.update(
				{
					password: bcrypt.hashSync(req.body.password, 10),
				},
				{ where: { jeton: req.params.jeton } }
			)
			.then(() => {
				res.send("password modified");
			})
			.catch((err) => {
				res.status(401).send(err);
			});
	}
};

// * Send an email for password forgotten
exports.emailPassword = (req, res) => {
	let transporter = nodemailer.createTransport({
		host: "source.o2switch.net",
		port: 465,
		// secure: true, // true for 465, false for other ports
		tls: {
			rejectUnauthorized: false,
		},
		auth: {
			user: process.env.FROM_EMAIL,
			pass: process.env.PASS_EMAIL,
		},
	});
	// Recherche  jeton
	volunteer
		.findOne({ where: { email: req.params.email } })
		.then((volunteer) => {
			//! Modif link with https !
			const jeton = volunteer.jeton;
			const email = req.params.email;
			const prenom = volunteer.first_name;
			const nom = volunteer.last_name;
			const titre = "[Cinéma Noyant] Demande d'initialisation mot de passe";
			const message =
				"<p>Merci de cliquer sur le lien pour saisir un nouveau mot de passe.</p>";
			transporter.sendMail(
				{
					from: "Cinéma Noyant <cinema-noyant@delmout.com>",
					to: email,
					subject: titre,
					html:
						"<p>Bonjour " +
						prenom +
						" " +
						nom +
						",</p></br>" +
						message +
						"</br><a href='http://localhot:8080/setpassword/" +
						jeton +
						"'>Saisir un nouveau mot de passe</a></br></br><p>Merci de ne pas répondre à cet email.</p>",
				},
				(error, info) => {
					if (error) {
						return res.status(401).send(error);
					}
					res.status(200).send("email envoyé !");
				}
			);
		})
		.catch((err) => res.status(401).send(err));
};

// * Send an email to all users for specific information
exports.emailInfo = (req, res) => {
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

	//! Mettre lien en https du site
	// List of volunteers
	volunteer
		.findAndCountAll()
		.then((volunteers) => {
			const count = volunteers.count;
			for (let i = 0; i < count; i++) {
				// Message for each volunteer
				transporter.sendMail(
					{
						from: "Cinéma Noyant <cinema-noyant@delmout.com>",
						to: volunteers.rows[i].email,
						subject: "[Cinéma Noyant] " + req.body.title,
						html:
							req.body.content +
							"<br/><a href='http://localhost:8080/'>Voir les permanences des bénévoles</a><br/><br/><p>Merci de ne pas répondre à cet email</p><p>L'administration de l'équipe Cinéma de Noyant</p>",
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
