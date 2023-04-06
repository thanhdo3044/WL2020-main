const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('ACCOUNT', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        account: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'ACCOUNT'
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'FIRST_NAME'
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'LAST_NAME'
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'ROLE_ID'
        }
    }, {
        tableName: 'ACCOUNT',
        timestamps: false,
        schema: 'base',
    });
};