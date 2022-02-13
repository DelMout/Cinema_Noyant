const { availability } = require("../models");

// * Create a new record of availability
exports.createAvailable = (req, res) => {
	const newAvailable = new availability({
		volunteerId: req.params.volunteerid,
		sessionId: req.params.sessionid,
		available: req.params.available,
	});
	newAvailable
		.save()
		.then((avail) => {
			res.status(200).send(avail);
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};

//* Modify the record of availability from a volunteer
exports.updateAvailable = (req, res) => {
	availability
		.update(
			{
				available: req.params.available,
			},
			{ where: { id: req.params.availabilityid } }
		)
		.then(() => {
			res.send("record of availability has been updated !");
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};

//* Modify the record of availability from administrator
exports.confirmAvailable = (req, res) => {
	availability
		.update(
			{
				available: req.params.available,
			},
			{ where: { id: req.params.availabilityid } }
		)
		.then(() => {
			res.send("record of availability has been updated !");
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};
