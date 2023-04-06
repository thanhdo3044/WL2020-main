/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('uomUom', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		factor: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
		rounding: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
		uomType: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		measureType: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE,
		},
		updatedAt: {
			allowNull: false,
			type: DataTypes.DATE,
		}
	}, {

	});
};