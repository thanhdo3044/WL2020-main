'use strict';
const {
    Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    class PRODItemInPackage extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.PRODItemInPackage.belongsTo(models.Package, {
                foreignKey: 'PACKAGE_ID'
            })
            models.PRODItemInPackage.belongsTo(models.ItemVCN, {
                foreignKey: 'ITEM_ID'
            })
        }
    };
    PRODItemInPackage.init({
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        PACKAGE_ID: {
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
        modelName: 'PRODItemInPackage',
        timestamps: false,
        schema: 'vcn',
        tableName: 'ITEM_IN_PACKAGE'
    });
    return PRODItemInPackage;
};