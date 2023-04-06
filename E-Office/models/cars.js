"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Cars extends Model {
        // static associate(models) {
        //     // Cars.belongsTo(models.OrderMeta, {
        //     //     foreignKey: {
        //     //         name: "orderMetaId"
        //     //     }
        //     // });
        //     // UserRegistration.belongsTo(models.Account, {
        //     //     foreignKey: {
        //     //         name: "accountId"
        //     //     }
        //     // });
        // }
    }
    Cars.init({
        // id: {
        //     allowNull: true,
        //     primaryKey: true,
        //     type: DataTypes.INTEGER,
        // },
        CODE: {
            allowNull: true,
            type: DataTypes.STRING
        },
        NAME: {
            allowNull: true,
            type: DataTypes.STRING
        },
        seats: {
            allowNull: true,
            type: DataTypes.INTEGER
        },
    }, {
        sequelize,
        modelName: "CARS",
        schema: "base"
    });
    // (async () => {
    //   await OrderMeta.sync({
    //     force: true
    //   });
    // })();

    return Cars;
};