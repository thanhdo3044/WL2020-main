const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('ROLE_MENU', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        guid: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            field: 'GUID',
            defaultValue: DataTypes.UUIDV4
        },
        roleValueId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'ROLE_VALUE_ID'
        },
        permissionId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'PERMISSION_ID'
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'CREATED_BY'
        },
        createdAt: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'CREATED_AT'
        }
    }, {
        tableName: 'ROLE_MENU',
        timestamps: false,
        schema: 'base',
    });
};