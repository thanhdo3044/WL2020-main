/* jshint indent: 2 */
const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('PRICE_QUOTE', {
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
      field: 'CODE'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'NAME'
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'PROJECT_ID'
    },
    version: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'VERSION'
    },
    totalWithoutTaxes: {
      type: "MONEY",
      allowNull: true,
      field: 'TOTAL_WITHOUT_TAXES'
    },
    taxes: {
      type: "MONEY",
      allowNull: true,
      field: 'TAXES'
    },
    total: {
      type: "MONEY",
      allowNull: true,
      field: 'TOTAL'
    },
    createBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'CREATE_BY'
    },
    createDate: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('GETDATE'),
      allowNull: true,
      field: 'CREATE_DATE'
    }
  }, {
    tableName: 'PRICE_QUOTE',
    timestamps: false,
    schema: 'fpm',
  });
};