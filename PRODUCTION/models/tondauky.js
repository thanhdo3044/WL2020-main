'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TonDauKy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  TonDauKy.init({
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    MONTH: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DEPARTMENT_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ITEM_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    QUANTITY: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    khoiLuongTonDauKy: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    WEEK: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PO_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    market_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true
    },
    CREATE_BY: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'TonDauKy',
    schema: 'dbo',
    tableName: 'View_OPENING_STOCK'
  });
  return TonDauKy;
};