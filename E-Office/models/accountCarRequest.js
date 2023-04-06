"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AccountCarRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    // }
  }
  AccountCarRequest.init(
    {
      accountId: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      carRequestId: {
        allowNull: false,
        type: DataTypes.UUID
      }
    },
    {
      sequelize,
      modelName: "AccountCarRequest",
      timestamps: false,
      schema: "eof"
    }
  );

  AccountCarRequest.removeAttribute("id");
  //   (async () => {
  //     await AccountCarRequest.sync({
  //       force: true
  //     });
  //   })();

  return AccountCarRequest;
};
