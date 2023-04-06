"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    // }
  }
  Message.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      accountId: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      orderId: {
        allowNull: false,
        type: DataTypes.UUID
      },
      text: {
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
      ,
      to_accountId: {
        allowNull: true,
        type: DataTypes.INTEGER
      }
      ,
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE
      }
      ,
      permission_delete: {
        allowNull: true,
        type: DataTypes.INTEGER
      }
      
    },
    {
      sequelize,
      modelName: "Message",
      schema: "eof"
    }
  );

  // (async () => {
  //   await Message.sync({
  //     force: true
  //   });
  // })();

  return Message;
};
