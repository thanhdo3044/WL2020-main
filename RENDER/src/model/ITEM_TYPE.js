const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('ITEM_TYPE', {
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
        }
    }, {
        tableName: 'ITEM_TYPE',
        timestamps: false,
        schema: 'base',
    });
};