module.exports = (sequelize, DataTypes) => {
	const availability = sequelize.define(
		"availability",
		{
			available: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			timestamps: false,
		}
	);
	return availability;
};
