const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('VENDOR', {
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
        active: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'ACTIVE'
        }
    }, {
        tableName: 'VENDOR',
        timestamps: false,
        schema: 'base',
    });
};