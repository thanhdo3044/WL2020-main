/* jshint indent: 2 */
const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CUSTOMER', {
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
    code: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'CODE',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
			field: 'NAME',
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
			field: 'DESCRIPTION',
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
			field: 'CITY',
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
			field: 'ADDRESS',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
			field: 'EMAIL',
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
			field: 'PHONE',
    },
    active: {
      type: DataTypes.INTEGER,
      allowNull: true,
			field: 'ACTIVE',
    },
    createBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
			field: 'CREATE_BY',
    },
    createDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.fn('GETDATE'),
			field: 'CREATE_DATE',
    }
  }, {
    tableName: 'CUSTOMER',
    timestamps: false,
		schema: 'fpm',
  });
};
