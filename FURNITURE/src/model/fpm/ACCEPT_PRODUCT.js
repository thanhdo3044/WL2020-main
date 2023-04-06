/* jshint indent: 2 */
const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
	return sequelize.define('ACCEPT_PRODUCT', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'ID'
		},
		// guid: {
		// 	type: DataTypes.UUIDV4,
		// 	allowNull: false,
		// 	field: 'GUID',
		// 	defaultValue: DataTypes.UUIDV4
		// },
		acceptId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'ACCEPT_ID'
		},
		productId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'PRODUCT_ID'
		},
		size: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'SIZE'
		},
		// unitId: {
		// 	type: DataTypes.INTEGER,
		// 	allowNull: true,
		// 	field: 'UNIT_ID'
		// },
		quantity: {
			type: "MONEY",
			allowNull: true,
			field: 'QUANTITY'
		},
		note: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'NOTE'
		},
		// type : {
		// 	type: DataTypes.INTEGER,
		// 	allowNull: true,
		// 	field: 'TYPE'
		// }
	}, {
		tableName: 'ACCEPT_PRODUCT',
		timestamps: false,
		schema: 'fpm'
	});
};