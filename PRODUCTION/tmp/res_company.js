/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('ResCompany', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
	}, {});
};