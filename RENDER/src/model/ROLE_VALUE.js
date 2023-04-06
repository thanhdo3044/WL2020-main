const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('ROLE_VALUE', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'ROLE_ID'
        },
        roleTypeId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'ROLE_TYPE_ID'
        },
        value : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'VALUE'
        }
    }, {
        tableName: 'ROLE_VALUE',
        timestamps: false,
        schema: 'base',
    });
};