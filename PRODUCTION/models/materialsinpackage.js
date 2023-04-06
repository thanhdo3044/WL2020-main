'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MaterialsInPackage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  MaterialsInPackage.init({
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    ITEM_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    QUANTITY: {
      type: "MONEY",
      allowNull: true
    },
    SOURCE_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DESTINATION_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    khoiLuongNhan: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    CREATE_DATE: {
      type: DataTypes.DATE,
      allowNull: true
    },
    VERIFY_DATE: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'MaterialsInPackage',
    schema: 'dbo',
    timestamps: false,
    tableName: '[View_MaterialInPackage]'
  });
  return MaterialsInPackage;
};