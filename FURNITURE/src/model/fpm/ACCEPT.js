/* jshint indent: 2 */
const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
	return sequelize.define('ACCEPT', {
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
			defaultValue: DataTypes.UUIDV4
		},
		projectId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'PROJECT_ID'
		},
		customerId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'CUSTOMER_ID'
		},
		address: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'ADDRESS'

		},
		categories: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'CATEGORIES'
		},
		createBy: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'CREATE_BY'
		},
		createDate: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: Sequelize.fn('GETDATE'),
			field: 'CREATE_DATE'
		},
		verifyBy : {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'VERIFY_BY'
		},
		verifyDate : {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'VERIFY_DATE'
		}
	}, {
		tableName: 'ACCEPT',
		timestamps: false,
		schema: 'fpm',
	});
};