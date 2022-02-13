module.exports = (sequelize, DataTypes) => {
	const volunteer = sequelize.define(
		"volunteer",
		{
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true,
					notEmpty: true,
				},
			},
			last_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			first_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			jeton: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			isAdmin: {
				type: DataTypes.TINYINT,
				defaultValue: 0,
			},
		},
		{
			timestamps: false,
		}
	);
	return volunteer;
};
