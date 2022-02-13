module.exports = (sequelize, DataTypes) => {
	const availability = sequelize.define(
		"availability",
		{
			available: {
				type: DataTypes.TINYINT,
				allowNull: false,
			},
		},
		{
			timestamps: false,
		}
	);
	return availability;
};
