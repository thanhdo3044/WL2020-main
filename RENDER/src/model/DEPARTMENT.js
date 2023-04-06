const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('DEPARTMENT', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'TYPE'
        },
        parentId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'PARENT_ID'
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
        packageTypeGroupId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'PACKAGE_TYPE_GROUP_ID'
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'ORDER'
        },
        caLamViec: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    }, {
        tableName: 'DEPARTMENT',
        timestamps: false,
        schema: 'base',
    });
};