const { session } = require("../models");

//* Create a new session
exports.createSession = (req, res) => {
	const newSession = new session({
		...req.body,
	});
	newSession
		.save()
		.then((session) => {
			res.send("new session created !");
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};

// * Get all sessions
exports.getAllSessions = (req, res) => {
	session.findAll({}).then((obj) => {
		res.send(obj);
	});
};

// * Delete a session
exports.delete = (req, res) => {
	session
		.destroy({ where: { id: req.params.sessionid } })
		.then(() => {
			res.send("session deleted");
		})
		.catch((err) => {
			res.send(err);
		});
};
