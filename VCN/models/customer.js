'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Customer.init({
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    GUID: {
      type: DataTypes.UUIDV4,
      allowNull: true
    },
    CODE: {
      type: DataTypes.STRING,
      allowNull: true
    },
    NAME: {
      type: DataTypes.STRING,
      allowNull: true
    },
    DESCRIPTION: {
      type: DataTypes.STRING,
      allowNull: true
    },
    CITY: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ADDRESS: {
      type: DataTypes.STRING,
      allowNull: true
    },
    EMAIL: {
      type: DataTypes.STRING,
      allowNull: true
    },
    PHONE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CREATE_BY: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CREATE_DATE: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ACTIVE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    factoryId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Customer',
    timestamps: false,
    schema: 'base',
    tableName: 'CUSTOMER'
  });

  // Customer.findByPk(100000).then(item => {
  //   console.log(item.toJSON())
  // })

  return Customer;
};