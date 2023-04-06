'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Package extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Package.init({
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    GUID: {
      type: DataTypes.UUIDV4,
      allowNull: false
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
      type: DataTypes.DATE,
      allowNull: true
    },
    VERIFY_BY: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    VERIFY_DATE: {
      type: DataTypes.DATE,
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
    factoryId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Package',
    timestamps: false,
    schema: 'prod',
    tableName: 'PACKAGE'
  });

  // Package.findByPk(100000).then(item => {
  //   console.log(item.toJSON())
  // })

  return Package;
};