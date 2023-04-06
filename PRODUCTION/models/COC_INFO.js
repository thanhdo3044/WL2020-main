/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('CocInfo', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			field: 'ID'
		},
		guid: {
			type: DataTypes.UUID,
			allowNull: false,
			field: 'GUID'
		},
		cocId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'COC_ID'
		},
		name: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'NAME'
		},
		vendor: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'VENDOR'
		},
		parcel: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'PARCEL'
		}
	}, {
		schema: 'prod',
		timestamps: false,
		tableName: 'COC_INFO'
	});
};