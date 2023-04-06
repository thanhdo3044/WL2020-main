"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CarApproval extends Model {
    static associate(models) {
      CarApproval.belongsTo(models.Account, {
        foreignKey: {
          name: "fromAccountId"
        }
      });
      CarApproval.belongsTo(models.Department, {
        foreignKey: {
          name: "departmentId"
        }
      });
    }
  }
  CarApproval.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      parentId: {
        allowNull: true,
        type: DataTypes.UUID
      },
      accountId: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      fromAccountId: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      carRequestId: {
        allowNull: false,
        type: DataTypes.UUID
      },
      departmentId: {
        type: DataTypes.INTEGER
      },
      factoryId: {
        type: DataTypes.INTEGER
      },
      title: {
        type: DataTypes.STRING
      },
      position: {
        type: DataTypes.STRING
      },
      name: {
        type: DataTypes.STRING
      },
      showMessages: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      isDisable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      status: {
        type: DataTypes.STRING
      },
      completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      modelName: "CarApproval",
      schema: "eof"
    }
  );

    // (async () => {
    //   await CarApproval.sync({
    //     force: true
    //   });
    // })();

  return CarApproval;
};
