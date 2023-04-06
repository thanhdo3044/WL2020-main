'use strict';
const {
  Model
} = require('sequelize');

const {
  Package,
  Item
} = require('./index')

module.exports = (sequelize, DataTypes) => {
  class ItemInPackage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.ItemInPackage.belongsTo(models.Package, {
        foreignKey: 'PACKAGE_ID'
      })
      models.ItemInPackage.belongsTo(models.Item, {
        foreignKey: 'ITEM_ID'
      })
    }
  };
  ItemInPackage.init({
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    PACKAGE_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ITEM_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    QUANTITY: {
      type: "MONEY",
      allowNull: true
    },
    STEP_OF_PALLET_ID: {
      type: DataTypes.INTEGER,
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
    ITEM_FROM_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TYPE_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    REMEDIES_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DESCRIPTION: {
      type: DataTypes.STRING,
      allowNull: true
    },
    CREATE_BY: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CREATE_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    VERIFY_BY: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    VERIFY_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    KH_VERIFY_BY: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    KH_VERIFY_DATE: {
      type: DataTypes.DATE,
      allowNull: true
    },
    PO: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'TYPE'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'NAME'
    },
    tenSP: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'tenSP'
    },
    khoiLuong: {
      type: "MONEY",
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'ItemInPackage',
    timestamps: false,
    schema: 'dbo',
    tableName: 'View_PackageDepartment'
  });
  return ItemInPackage;
};