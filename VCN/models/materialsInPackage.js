'use strict';
const {
    Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    class MaterialsInPackage extends Model {
    };
    MaterialsInPackage.init({
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        ITEM_IN_PACKAGE_ID: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'ITEM_ID'
        },
        quantity: {
            type: "MONEY",
            allowNull: true,
            field: 'QUANTITY'
        },
        factoryId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'MaterialsInPackage',
        timestamps: false,
        schema: 'vcn',
        tableName: '[MATERIALS_IN_PACKAGE]'
    });
    return MaterialsInPackage;
};