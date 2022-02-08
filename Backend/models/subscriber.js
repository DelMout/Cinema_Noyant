module.exports = (sequelize, DataTypes) => {
	const subscriber = sequelize.define(
		"subscriber",
		{
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				// validate: {
				// 	isEmail: true,
				// 	notEmpty: true,
				// },
			},
			last_name: {
				type: DataTypes.STRING,
				allowNull: false,
				// validate: {
				// 	notEmpty: true,
				// 	is: ["^[a-zÀ-ÿ- ']+$", "i"],
				// },
			},
			first_name: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			timestamps: false,
		}
	);
	return subscriber;
};
