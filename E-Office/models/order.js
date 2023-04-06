"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.hasMany(models.Request, {
                foreignKey: {
                    name: "orderId"
                }
            });
            Order.belongsTo(models.ProposalForm, {
                foreignKey: {
                    name: "proposalFormId"
                }
            });
            Order.belongsTo(models.Department, {
                foreignKey: {
                    name: "departmentId"
                }
            });
            Order.belongsTo(models.Account, {
                foreignKey: {
                    name: "accountId"
                }
            });
            Order.hasMany(models.OrderMeta, {
                foreignKey: {
                    name: "orderId"
                }
            });
            Order.hasMany(models.Message, {
                foreignKey: {
                    name: "orderId"
                }
            });
        }
    }
    Order.init({
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
            allowNull: true
        },
        proposalFormId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Biểu mẫu"
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
        },
        slug: {
            allowNull: true,
            type: DataTypes.STRING
        },
        edit: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        priorityLevel: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: false
        },
        computerEquipment: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: false
        },
        intendedUse: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        activeSeen: {
            type: DataTypes.INTEGER,
        },
        timeSeen: {
            type: DataTypes.STRING,
        },
        activeSuccess: {
            type: DataTypes.INTEGER,
        },
        timeSuccess: {
            type: DataTypes.STRING,
        },
        nameSuccess: {
            type: DataTypes.STRING,
        },
    }, {
        sequelize,
        paranoid: true,
        modelName: "Order",
        schema: "eof"
    });
    // (async () => {
    //   await Order.sync({
    //     force: true
    //   });
    // })();
    return Order;
};