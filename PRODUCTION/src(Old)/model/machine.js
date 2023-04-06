const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('MACHINE', {
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
        code: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'CODE'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'NAME'
        },
        quantity: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'QUANTITY'
        },
        departmentId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'DEPARTMENT_ID'
        },
        workers: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'WORKERS'
        }
    }, {
        tableName: 'MACHINE',
        timestamps: false,
        schema: 'prod',
    });
};