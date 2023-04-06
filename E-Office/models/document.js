"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DOCUMENT extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    // }
  }
  DOCUMENT.init(
    {
      last_name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "last_name"
      },
      date: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "date"
      },
      time: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "time"
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "status"
      },
      account: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "account"
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "created_by"
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "createdAt"
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "updatedAt"
      },
      created_date: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "created_date"
      },
      updated_date: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "updated_date"
      }
    },
    {
      sequelize,
      tableName: "DOCUMENT",
      modelName: "DOCUMENT",
      schema: "eof"
    }
  );

  return DOCUMENT;
};
