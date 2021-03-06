const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, process.env.JWT_KEY);
		const userId = decodedToken.volunteerId;
		const isAdmin = decodedToken.isAdmin;
		const paramUserId = parseInt(req.params.userid);

		if (isAdmin === 0 && paramUserId && paramUserId !== userId) {
			throw "Invalid user ID";
		} else {
			if (isAdmin === 1 && userId !== parseInt(process.env.ID_ADMINBIS)) {
				if (isAdmin === 1 && userId !== parseInt(process.env.ID_ADMIN)) {
					throw "Invalid user ID";
				} else {
					next();
				}
			} else {
				next();
			}
		}
	} catch (error) {
		res.status(401).send(error);
	}
};
