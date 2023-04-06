const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('MARKET', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        code: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'CODE'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'NAME'
        },
        productId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'PRODUCT_ID'
        }
    }, {
        tableName: 'MARKET',
        timestamps: false,
        schema: 'base',
    });
};