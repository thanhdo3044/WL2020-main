"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Request extends Model {
        static associate(models) {
            Request.belongsTo(models.Account, {
                foreignKey: {
                    name: "fromAccountId"
                }
            });
            Request.belongsTo(models.Department, {
                foreignKey: {
                    name: "departmentId"
                }
            });
            Request.belongsTo(models.Order, {
                foreignKey: {
                    name: "orderId"
                }
            });
        }
    }
    Request.init({
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
        accountId2: {
            allowNull: true,
            type: DataTypes.INTEGER
        },
        accountId2Active: {
            allowNull: true,
            type: DataTypes.INTEGER
        },
        fromAccountId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        orderId: {
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
        },
        slug: {
            allowNull: true,
            type: DataTypes.STRING
        },
        star: {
            allowNull: true,
            type: DataTypes.INTEGER
        },
        show: {
            allowNull: true,
            type: DataTypes.INTEGER
        },
        step: {
            allowNull: true,
            type: DataTypes.INTEGER
        },
        edit: {
            allowNull: true,
            type: DataTypes.STRING
        },
        timeVTAccept: {
            allowNull: true,
            type: DataTypes.STRING
        },
        timeEndAuthority: {
            allowNull: true,
            type: DataTypes.STRING
        },
        timeStartAuthority: {
            allowNull: true,
            type: DataTypes.STRING
        },
        idReqAuthority: {
            allowNull: true,
            type: DataTypes.STRING
        },
        isAuthority: {
            allowNull: true,
            defaultValue: false,
            type: DataTypes.INTEGER
        },
        accountIdAuthorised: {
            allowNull: true,
            type: DataTypes.INTEGER
        },
        timeStartAuthorised: {
            allowNull: true,
            type: DataTypes.STRING
        },
        timeEndAuthorised: {
            allowNull: true,
            type: DataTypes.STRING
        },
        timeAuthorityActive: {
            allowNull: true,
            type: DataTypes.STRING
        },
        timeVTAcceptEnd: {
            allowNull: true,
            type: DataTypes.STRING
        },
        successOrder: {
            allowNull: true,
            type: DataTypes.INTEGER
        },
        successRequest: {
            allowNull: true,
            type: DataTypes.STRING
        },
        uyQuyen: {
            allowNull: true,
            type: DataTypes.STRING
        },
    }, {
        sequelize,
        modelName: "Request",
        schema: "eof",
        timestamps: false
    });

    // (async () => {
    //   await Request.sync({
    //     force: true
    //   });
    // })();

    return Request;
};