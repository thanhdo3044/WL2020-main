"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class UserRegistration extends Model {
        static associate(models) {
            UserRegistration.belongsTo(models.OrderMeta, {
                foreignKey: {
                    name: "orderMetaId"
                }
            });
            UserRegistration.belongsTo(models.Account, {
                foreignKey: {
                    name: "accountId"
                }
            });
            UserRegistration.belongsTo(models.CalendarWork, {
                foreignKey: {
                    name: "calendarWorkId"
                }
            });
        }
    }
    UserRegistration.init({
        // id: {
        //     allowNull: true,
        //     primaryKey: true,
        //     type: DataTypes.INTEGER,
        // },
        accountId: {
            allowNull: true,
            type: DataTypes.STRING
        },
        orderMetaId: {
            allowNull: true,
            type: DataTypes.STRING
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        calendarWorkId: {
            allowNull: true,
            type: DataTypes.INTEGER
        }
    }, {
        sequelize,
        modelName: "UserRegistration",
        schema: "eof"
    });
    // (async () => {
    //   await OrderMeta.sync({
    //     force: true
    //   });
    // })();

    return UserRegistration;
};