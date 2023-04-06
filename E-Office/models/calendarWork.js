"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class CalendarWork extends Model {
        static associate(models) {
            CalendarWork.belongsTo(models.Account, {
                foreignKey: {
                    name: "accountId"
                }
            });
        }
    }
    CalendarWork.init({

        accountId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        description: {
            allowNull: true,
            type: DataTypes.STRING
        },
        startDate: {
            allowNull: true,
            type: DataTypes.STRING
        },
        endDate: {
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
        position: {
            allowNull: true,
            type: DataTypes.STRING
        },
        location: {
            allowNull: true,
            type: DataTypes.STRING
        },
        sumPeople: {
            allowNull: true,
            type: DataTypes.INTEGER
        },
        title: {
            allowNull: true,
            type: DataTypes.STRING
        },
        slug: {
            allowNull: true,
            type: DataTypes.STRING
        },
        numberPhone: {
            allowNull: true,
            type: DataTypes.STRING
        },
        bgcolor: {
            allowNull: true,
            type: DataTypes.STRING
        },
        icon: {
            allowNull: true,
            type: DataTypes.STRING
        },
        permission: {
            type: DataTypes.INTEGER,
            allowNull: true
        }

    }, {
        sequelize,
        modelName: "CalendarWork",
        tableName: "CalendarWork",
        schema: "eof"
    });

    // (async () => {
    //   await Message.sync({
    //     force: true
    //   });
    // })();

    return CalendarWork;
};