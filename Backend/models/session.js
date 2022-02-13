module.exports = (sequelize, DataTypes) => {
	const session = sequelize.define(
		"session",
		{
			date: {
				type: DataTypes.DATEONLY,
				allowNull: false,
				require,
				validate: {
					notEmpty: true,
				},
			},
			time: {
				type: DataTypes.STRING,
				allowNull: false,
				require,
				validate: {
					notEmpty: true,
				},
			},
		},
		{
			timestamps: false,
		}
	);
	return session;
};
