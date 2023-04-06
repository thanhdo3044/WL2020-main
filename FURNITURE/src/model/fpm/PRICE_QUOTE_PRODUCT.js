/* jshint indent: 2 */
const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
	return sequelize.define('PRICE_QUOTE_PRODUCT', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'ID'
		},
		guid: {
			type: DataTypes.UUIDV4,
			allowNull: false,
			field: 'GUID',
			defaultValue: Sequelize.UUIDV4
		},
		priceQuoteId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'PRICE_QUOTE_ID'
		},
		productId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'PRODUCT_ID'
		},
		spec: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'SPEC'
		},
		size: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'SIZE'
		},
		unitId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'UNIT_ID'
		},
		quantity: {
			type: "MONEY",
			allowNull: true,
			field: 'QUANTITY'
		},
		unitPrice: {
			type: "MONEY",
			allowNull: true,
			field: 'UNIT_PRICE'
		},
		taxes: {
			type: "MONEY",
			allowNull: true,
			field: 'TAXES'
		},
		price: {
			type: "MONEY",
			allowNull: true,
			field: 'PRICE'
		},
		note: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'NOTE'
		}
	}, {
		tableName: 'PRICE_QUOTE_PRODUCT',
		timestamps: false,
		schema: 'fpm',
	});
};