"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CarRequest extends Model {
    static associate(models) {
      CarRequest.hasMany(models.CarApproval, {
        foreignKey: {
          name: "carRequestId"
        }
      });

      CarRequest.belongsTo(models.Department, {
        foreignKey: {
          name: "departmentId"
        }
      });
      CarRequest.belongsTo(models.Account, {
        foreignKey: {
          name: "accountId"
        }
      });
    }
  }
  CarRequest.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      number: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false
      },
      car: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      accountId: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      departmentId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      factoryId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      proposalFormId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Đặt xe đi công tác"
      },
      fromLocation: {
        type: DataTypes.STRING,
        allowNull: true
      },
      toLocation: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fromDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      toDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Mới"
      },
      approved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
      paranoid: true,
      modelName: "CarRequest",
      schema: "eof"
    }
  );
//   (async () => {
//     await CarRequest.sync({
//       force: true
//     });
//   })();
  return CarRequest;
};
