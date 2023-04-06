/* jshint indent: 2 */
const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('RECEIPT_PRODUCT', {
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
    receiptId: {
      type: DataTypes.INTEGER,
      allowNull: true,
			field: 'RECEIPT_ID'
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
			field: 'PRODUCT_ID'
    },
    unitPrice: {
      type: "MONEY",
      allowNull: true,
			field: 'UNIT_PRICE'
    },
    quantity: {
      type: "MONEY",
      allowNull: true,
			field: 'QUANTITY'
    },
    amount: {
      type: "MONEY",
      allowNull: true,
			field: 'AMOUNT'
    }
  }, {
    tableName: 'RECEIPT_PRODUCT',
    timestamps: false,
		schema: 'fpm',
  });
};
