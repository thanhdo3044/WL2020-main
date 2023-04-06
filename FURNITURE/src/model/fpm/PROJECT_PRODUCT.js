/* jshint indent: 2 */
const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PROJECT_PRODUCT', {
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
			field: 'PROJECT_ID'
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
			field: 'PRODUCT_ID'
    },
    quantity: {
      type: "MONEY",
      allowNull: true,
			field: 'QUANTITY'
    },
    length: {
      type: "MONEY",
      allowNull: true,
			field: 'LENGTH'
    },
    width: {
      type: "MONEY",
      allowNull: true,
			field: 'WIDTH'
    },
    height: {
      type: "MONEY",
      allowNull: true,
			field: 'HEIGHT'
    }
  }, {
    tableName: 'PROJECT_PRODUCT',
    timestamps: false,
    schema: 'fpm',
  });
};
