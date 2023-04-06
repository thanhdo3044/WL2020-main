"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AccountForm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    // }
  }
  AccountForm.init(
    {
      accountId: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      proposalFormId: {
        allowNull: false,
        type: DataTypes.INTEGER
      }
    },
    {
      sequelize,
      modelName: "AccountForm",
      timestamps: false,
      schema: "base"
    }
  );

  AccountForm.removeAttribute("id");

  return AccountForm;
};
