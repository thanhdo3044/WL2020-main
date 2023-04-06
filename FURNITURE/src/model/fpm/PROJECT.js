/* jshint indent: 2 */
const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
	return sequelize.define('PROJECT', {
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
		projectParentId: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'PROJECT_PARENT_ID'
		},
		code: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'CODE'
		},
		name: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'NAME'
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'DESCRIPTION'
		},
		customerId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'CUSTOMER_ID'
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
		}
	}, {
		tableName: 'PROJECT',
		timestamps: false,
		schema: 'fpm',
	});
};