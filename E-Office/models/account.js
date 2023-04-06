"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    // }
    static associate(models) {
      Account.belongsTo(models.Order, {
        foreignKey: {
          name: "ID",
        },
      });
    }
  }
  Account.init(
    {
      ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      account: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ACCOUNT",
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'FIRST_NAME'
    },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "LAST_NAME",
      },
    typeUser: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'TYPE_USER'
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'ROLE_ID'
    },
    factoryId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
      position: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "POSITION",
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "PASSWORD",
      },
      departmentId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    createBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'CREATE_BY'
    },
    PHONE: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'PHONE'
    },
    EMAIL: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'EMAIL'
  },
    unActive: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'unActive'
    },
    timeUnActive: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'timeUnActive',
        
    },
    },
    {
      sequelize,
      modelName: "Account",
      tableName: "ACCOUNT",
      schema: "base",
    }
  );

  return Account;
};
