const { subscriber } = require("../models");
const nodemailer = require("nodemailer");
const path = require("path");
let formidable = require("formidable");
let fs = require("fs");
const fileUpload = require("express-fileupload");

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
							"<img style='width:250px;margin-top:10px' src='cid:affiche@cinema.com'/><br/><br/><p>Merci de ne pas répondre à cet email</p><p>L'équipe Cinéma Noyant<br/>Familles Rurales</p>",
						attachments: [
							{
								filename: req.body.filename,
								path: path.join(__dirname, "../images/" + req.body.filename),
								cid: "affiche@cinema.com",
								contentDisposition: "inline",
							},
							// {
							// 	filename: "affiche_un.jpg",
							// 	path: path.join(__dirname, "../images/affiche_un.jpg"),
							// 	cid: "affiche@cinema.com",
							// 	contentDisposition: "inline",
							// },
						],
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

//* Save an image
// exports.saveImage = (req, res) => {
// const fileName = req.files.myFile.name;
// const path = __dirname + "/images/" + fileName;

// req.files.myFile.mv(path, function (err) {
// 	if (err) return res.status(500).send(err);

// 	res.send("File uploaded!");
// });

// let form = new formidable.IncomingForm();
// form.parse(req, function (error, fields, file) {
// 	let filepath = file.fileupload.filepath;
// 	let newpath = __dirname + "/images/";
// 	newpath += file.fileupload.originalFilename;
// 	fs.rename(filepath, newpath, function () {
// 		res.write("NodeJS File Upload Success!");
// 		res.end();
// 	});
// });

// let sampleFile;
// let uploadPath;

// if (!req.files || Object.keys(req.files).length === 0) {
// 	return res.status(400).send("No files were uploaded.");
// }

// // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
// sampleFile = req.files.image;
// uploadPath = __dirname + "/images/" + sampleFile.name;

// // Use the mv() method to place the file somewhere on your server
// sampleFile.mv(uploadPath, function (err) {
// 	if (err) return res.status(500).send(err);

// 	res.send("File uploaded!");
// });

// 	const file = req.file.filename;
// 	console.log(file);
// 	res.status(200).send("OKay");
// };
