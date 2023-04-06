/* jshint indent: 2 */
const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('RECEIPT', {
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
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field : 'PROJECT_ID'
    },
    typeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field : 'TYPE_ID'
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true,
      field : 'CONTENT'
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      field : 'DESCRIPTION'
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field : 'CUSTOMER_ID'
    },
    totalAmount: {
      type: "MONEY",
      allowNull: true,
      field : 'TOTAL_AMOUNT'
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
      field : 'NOTE'
    },
    createBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field : 'CREATE_BY'
    },
    createDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.fn('GETDATE'),
      field : 'CREATE_DATE'
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
    tableName: 'RECEIPT',
    timestamps: false,
		schema: 'fpm',
  });
};
