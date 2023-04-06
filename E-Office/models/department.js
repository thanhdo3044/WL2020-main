"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Department extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        // static associate(models) {
        //   // define association here
        // }
        static associate(models) {
            Department.belongsTo(models.Order, {
                foreignKey: {
                    name: "ID"
                }
            });
        }
    }
    Department.init({
        ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: true,
            field: "CODE"
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            field: "NAME"
        },
        accountId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        accountId1: {
            allowNull: true,
            type: DataTypes.INTEGER
        },
        accountId2: {
            allowNull: true,
            type: DataTypes.INTEGER
        }
    }, {
        sequelize,
        tableName: "DEPARTMENT",
        timestamps: false,
        modelName: "Department",
        schema: "base"
    });

    return Department;
};